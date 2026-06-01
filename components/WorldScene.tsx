"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial, Stars } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { interpolate } from "remotion";

/* ─────────────────────────────────────────────────────────────────
   2 HEX COLORS ONLY (mont-fort principle)
   #080A08  near-black  — sky, deep terrain
   #E8E4DC  off-white   — mountains, clouds, mist, text
   ───────────────────────────────────────────────────────────────── */
const INK   = "#080A08";
const PAPER = "#E8E4DC";

/* ── Sky shader — gradient from dark top to lighter horizon ──────── */
const SkyMat = shaderMaterial(
  { uProgress: 0 },
  `varying vec2 vUv;
   void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  `uniform float uProgress;
   varying vec2 vUv;
   void main() {
     // Horizon slightly lighter — creates silhouette contrast
     vec3 top    = vec3(0.028, 0.033, 0.027);
     vec3 horiz  = vec3(0.09,  0.10,  0.085);
     vec3 ground = vec3(0.02,  0.025, 0.018);
     float t = vUv.y;
     vec3 col = t > 0.45
       ? mix(horiz, top,   smoothstep(0.45, 1.0, t))
       : mix(ground, horiz, smoothstep(0.0,  0.45, t));
     // Slightly warm at horizon when descending
     col += vec3(0.04, 0.03, 0.01) * smoothstep(0.3, 0.5, t) * uProgress * 0.4;
     gl_FragColor = vec4(col, 1.0);
   }`
);
extend({ SkyMat });

declare module "@react-three/fiber" {
  interface ThreeElements {
    skyMat: { uProgress?: number; ref?: React.Ref<THREE.ShaderMaterial> };
  }
}

function Sky({ progress }: { progress: number }) {
  const ref = useRef<THREE.ShaderMaterial>(null);
  useFrame(() => { if (ref.current) ref.current.uniforms.uProgress.value = progress; });
  return (
    <mesh position={[0, 0, -90]} renderOrder={-1}>
      <planeGeometry args={[300, 120]} />
      {/* @ts-ignore */}
      <skyMat ref={ref} depthWrite={false} />
    </mesh>
  );
}

/* ── Mountain ridge — LIGHT silhouette on dark sky ───────────────── */
function Ridge({ z, scaleX = 1, scaleY = 1, opacity = 1 }: {
  z: number; scaleX?: number; scaleY?: number; opacity?: number;
}) {
  const noise = useMemo(() => createNoise2D(), []);
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [new THREE.Vector2(-80, -4)];
    for (let x = -80; x <= 80; x += 0.5) {
      const y =
        noise(x * 0.018 * scaleX, 0) * 22 * scaleY +
        noise(x * 0.055 * scaleX, 0) * 6  * scaleY +
        noise(x * 0.15  * scaleX, 0) * 1.8 * scaleY + 4 * scaleY;
      pts.push(new THREE.Vector2(x, y));
    }
    pts.push(new THREE.Vector2(80, -4));
    return new THREE.ShapeGeometry(new THREE.Shape(pts));
  }, [noise, scaleX, scaleY]);

  return (
    <mesh geometry={geo} position={[0, 0, z]} renderOrder={1}>
      <meshBasicMaterial color={PAPER} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Ground terrain — dark, scrolling forward ────────────────────── */
function Terrain({ offsetZ }: { offsetZ: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const noise = useMemo(() => createNoise2D(), []);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(120, 100, 200, 200);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const h = noise(p.getX(i) * 0.04, p.getY(i) * 0.04) * 4
              + noise(p.getX(i) * 0.12, p.getY(i) * 0.12) * 1.2;
      p.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, [noise]);

  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.position.z += d * 0.14;
    if (ref.current.position.z > 40) ref.current.position.z -= 80;
  });

  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, offsetZ]}>
      <meshStandardMaterial
        color="#0D110C"
        roughness={0.95}
        metalness={0.0}
      />
    </mesh>
  );
}

/* ── Cloud particles — off-white, layered ────────────────────────── */
function Clouds({ y, count = 3500, size = 1.8, opacity = 0.065 }: {
  y: number; count?: number; size?: number; opacity?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const pts = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i*3]   = (Math.random()-0.5)*240;
      a[i*3+1] = (Math.random()-0.5)*16;
      a[i*3+2] = (Math.random()-0.5)*240;
    }
    return a;
  }, [count]);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.006; });
  return (
    <points ref={ref} position={[0, y, 0]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pts, 3]} /></bufferGeometry>
      <pointsMaterial size={size} color={PAPER} transparent opacity={opacity} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Mist layer — thin horizontal band at cloud altitude ─────────── */
function MistBand({ y }: { y: number }) {
  return (
    <mesh position={[0, y, -10]}>
      <planeGeometry args={[300, 12]} />
      <meshBasicMaterial color={PAPER} transparent opacity={0.018} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── City silhouette — emerges below cloud layer ─────────────────── */
function CityZurich() {
  const buildings = useMemo(() => {
    const rows = [3,9,2,14,3.5,7,1.5,17,2.5,10,3,12,4,6,1.5,19,2,11,3.5,15,2,8,3,13];
    const out: {x:number;w:number;h:number}[] = [];
    let x = -34;
    for (let i = 0; i < rows.length; i+=2) {
      out.push({x: x + rows[i]/2, w: rows[i], h: rows[i+1]});
      x += rows[i] + 0.22;
    }
    return out;
  }, []);
  return (
    <group position={[0, -16, -6]}>
      {buildings.map((b,i) => (
        <mesh key={i} position={[b.x - 8, b.h/2 - 10, 0]}>
          <boxGeometry args={[b.w, b.h, 0.4]} />
          <meshBasicMaterial color={PAPER} transparent opacity={0.55} />
        </mesh>
      ))}
      <mesh position={[0, -10.1, 0]}>
        <planeGeometry args={[200, 0.3]} />
        <meshBasicMaterial color={PAPER} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/* ── Globe with arc lines ────────────────────────────────────────── */
function Globe({ visibility }: { visibility: number }) {
  const grp = useRef<THREE.Group>(null);
  useFrame((_,d) => { if (grp.current) grp.current.rotation.y += d * 0.06; });

  const ll = (lat: number, lon: number, r = 6.4) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const the = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(the),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(the)
    );
  };

  const locations = [
    { lat: 47.37, lon: 8.54,  name: "Zürich"    },
    { lat: 47.16, lon: 8.51,  name: "Zug"       },
    { lat: 25.20, lon: 55.27, name: "Dubai"     },
    { lat: 24.45, lon: 54.37, name: "Abu Dhabi" },
  ];

  const arcGeo = useMemo(() => {
    // Arc Zürich → Dubai
    const a = ll(47.37, 8.54), b = ll(25.20, 55.27);
    const pts: THREE.Vector3[] = [];
    for (let i=0; i<=60; i++) {
      const t = i/60;
      const p = new THREE.Vector3().lerpVectors(a,b,t);
      p.normalize().multiplyScalar(6.4 + Math.sin(t*Math.PI)*2.2);
      pts.push(p);
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const o = Math.max(0, Math.min(1, visibility));
  if (o < 0.01) return null;

  return (
    <group ref={grp} position={[0, -1, -14]}>
      {/* Sphere wireframe */}
      <mesh>
        <sphereGeometry args={[6.4, 40, 40]} />
        <meshBasicMaterial color={PAPER} wireframe transparent opacity={0.12 * o} />
      </mesh>
      {/* Equator */}
      <mesh rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[6.4, 0.007, 12, 120]} />
        <meshBasicMaterial color={PAPER} transparent opacity={0.2 * o} />
      </mesh>
      {/* Arc */}
      <line geometry={arcGeo}>
        <lineBasicMaterial color={PAPER} transparent opacity={0.3 * o} />
      </line>
      {/* Location dots */}
      {locations.map(loc => {
        const pos = ll(loc.lat, loc.lon);
        return (
          <group key={loc.name} position={pos}>
            <mesh>
              <sphereGeometry args={[0.16, 10, 10]} />
              <meshBasicMaterial color={PAPER} transparent opacity={o} />
            </mesh>
            {/* Pulse ring */}
            <mesh rotation={[Math.PI/2,0,0]}>
              <torusGeometry args={[0.35, 0.008, 8, 40]} />
              <meshBasicMaterial color={PAPER} transparent opacity={0.4 * o} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ── Camera driven by Remotion interpolate ───────────────────────── */
function CameraRig({ progress }: { progress: number }) {
  const { camera, scene } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progress;

    // Remotion interpolate — smoother than lerp, supports easing + clamp
    const camY = interpolate(p, [0, 0.4, 0.7, 1.0], [62, 2, -4, 6], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const camZ = interpolate(p, [0, 1], [-6, 38], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const fov = interpolate(p, [0, 0.5, 1], [42, 54, 62], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const lookY = interpolate(p, [0, 0.4, 1], [22, -8, 2], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

    camera.position.set(
      Math.sin(t * 0.08) * 2.2,
      camY + Math.sin(t * 0.13) * 0.25,
      camZ
    );
    (camera as THREE.PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();
    camera.lookAt(0, lookY, -22);

    // Fog thickens inside cloud layer (p ~0.22)
    const inCloud = Math.max(0, 1 - Math.abs(p - 0.22) * 10);
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = interpolate(inCloud, [0, 1], [0.006, 0.055], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
  });

  return null;
}

/* ── Scene ───────────────────────────────────────────────────────── */
function SceneInner({ progress }: { progress: number }) {
  const globeVis = interpolate(progress, [0.72, 0.88], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <>
      <fogExp2 attach="fog" args={[INK, 0.006]} />
      <color attach="background" args={[INK]} />

      {/* Low ambient — just enough to see terrain */}
      <ambientLight intensity={0.08} color="#c8d4c4" />
      <directionalLight position={[20, 40, -15]} intensity={0.35} color="#dce4d8" />
      <pointLight position={[0, 25, -30]} intensity={0.4} color="#a8b8a4" decay={2} />

      {/* Stars — visible above clouds */}
      <Stars radius={130} depth={50} count={3000} factor={2.8} saturation={0} fade speed={0.35} />

      {/* Sky gradient plane behind everything */}
      <Sky progress={progress} />

      {/* Mountain ridges — LIGHT on DARK sky — 4 depth layers */}
      <Ridge z={-88} scaleX={1.4} scaleY={1.5} opacity={0.22} />
      <Ridge z={-62} scaleX={1.1} scaleY={1.2} opacity={0.38} />
      <Ridge z={-44} scaleX={0.85} scaleY={0.95} opacity={0.55} />
      <Ridge z={-28} scaleX={0.65} scaleY={0.72} opacity={0.75} />

      {/* Cloud bands */}
      <Clouds y={30} count={4000} size={2.8} opacity={0.055} />
      <Clouds y={22} count={5000} size={1.6} opacity={0.08} />
      <Clouds y={14} count={2500} size={3.5} opacity={0.04} />
      <MistBand y={25} />
      <MistBand y={18} />

      {/* Scrolling dark terrain */}
      <Terrain offsetZ={0} />
      <Terrain offsetZ={-40} />

      {/* City silhouette — appears below clouds */}
      <CityZurich />

      {/* Globe — appears at end */}
      <Globe visibility={globeVis} />

      <CameraRig progress={progress} />

      <EffectComposer>
        <DepthOfField focusDistance={0.008} focalLength={0.04} bokehScale={4} />
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.85} intensity={0.35} />
        <Noise opacity={0.024} />
        <Vignette eskil={false} offset={0.08} darkness={0.92} />
      </EffectComposer>
    </>
  );
}

export default function WorldScene({ progress }: { progress: number }) {
  return (
    <Canvas
      camera={{ position: [0, 62, -6], fov: 42, near: 0.3, far: 300 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
    >
      <SceneInner progress={progress} />
    </Canvas>
  );
}
