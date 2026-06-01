"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { DepthOfField, Bloom, Noise, Vignette, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

/* ─── Terrain mesh — procedural, Perlin-driven ───────────────────── */
function Terrain({ offsetZ = 0, color = "#1B3A2E" }: { offsetZ?: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const noise2D = useMemo(() => createNoise2D(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(80, 80, 160, 160);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Layered noise for realistic terrain
      const h =
        noise2D(x * 0.04, y * 0.04) * 4.5 +
        noise2D(x * 0.1,  y * 0.1)  * 1.8 +
        noise2D(x * 0.25, y * 0.25) * 0.6;
      pos.setZ(i, h);
    }
    geo.computeVertexNormals();
    return geo;
  }, [noise2D]);

  // Slow scroll — terrain drifts forward
  useFrame((_, delta) => {
    if (ref.current) ref.current.position.z += delta * 0.18;
    if (ref.current && ref.current.position.z > 20) ref.current.position.z -= 40;
  });

  return (
    <mesh ref={ref} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, offsetZ]}>
      <meshStandardMaterial
        color={color}
        roughness={0.92}
        metalness={0.02}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

/* ─── Second terrain layer — slightly different noise ─────────────── */
function Terrain2() {
  const ref = useRef<THREE.Mesh>(null);
  const noise2D = useMemo(() => createNoise2D(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(80, 80, 120, 120);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const h =
        noise2D(x * 0.035 + 5, y * 0.035 + 5) * 5 +
        noise2D(x * 0.09  + 5, y * 0.09  + 5) * 1.5;
      pos.setZ(i, h);
    }
    geo.computeVertexNormals();
    return geo;
  }, [noise2D]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.position.z += delta * 0.18;
    if (ref.current && ref.current.position.z > 40) ref.current.position.z -= 80;
  });

  return (
    <mesh ref={ref} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, -40]}>
      <meshStandardMaterial color="#152e22" roughness={0.95} metalness={0.0} />
    </mesh>
  );
}

/* ─── Distant mountain silhouettes ────────────────────────────────── */
function Mountains() {
  const noise2D = useMemo(() => createNoise2D(), []);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-50, 0);
    for (let x = -50; x <= 50; x += 0.5) {
      const y =
        noise2D(x * 0.03, 0) * 12 +
        noise2D(x * 0.08, 0) * 4 +
        noise2D(x * 0.2, 0)  * 1.5 + 4;
      shape.lineTo(x, y);
    }
    shape.lineTo(50, 0);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [noise2D]);

  return (
    <mesh geometry={geometry} position={[0, -3, -38]}>
      <meshBasicMaterial color="#0E1E16" transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── Far mountains — even more distant ───────────────────────────── */
function MountainsFar() {
  const noise2D = useMemo(() => createNoise2D(), []);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-60, 0);
    for (let x = -60; x <= 60; x += 0.8) {
      const y =
        noise2D(x * 0.025 + 20, 0) * 18 +
        noise2D(x * 0.06  + 20, 0) * 5 + 6;
      shape.lineTo(x, y);
    }
    shape.lineTo(60, 0);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [noise2D]);

  return (
    <mesh geometry={geometry} position={[0, -3.5, -55]}>
      <meshBasicMaterial color="#0A1610" transparent opacity={0.75} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── Floating dust/snow particles ────────────────────────────────── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 600;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = Math.random() * 20 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.06;
    ref.current.rotation.y = t;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#a8c4b0" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

/* ─── Slow cinematic camera drift ─────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.06) * 1.8;
    camera.position.y = 4 + Math.sin(t * 0.04) * 0.4;
    camera.lookAt(0, 0, -10);
  });
  return null;
}

/* ─── Sky gradient plane ───────────────────────────────────────────── */
function Sky() {
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    varying vec2 vUv;
    void main() {
      vec3 topColor    = vec3(0.04, 0.09, 0.06);
      vec3 horizColor  = vec3(0.08, 0.17, 0.12);
      vec3 groundColor = vec3(0.06, 0.12, 0.09);
      float t = vUv.y;
      vec3 col = mix(groundColor, horizColor, smoothstep(0.0, 0.45, t));
      col = mix(col, topColor, smoothstep(0.4, 1.0, t));
      gl_FragColor = vec4(col, 1.0);
    }
  `;
  return (
    <mesh position={[0, 0, -60]} rotation={[0, 0, 0]}>
      <planeGeometry args={[200, 80]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} depthWrite={false} />
    </mesh>
  );
}

/* ─── Main export ──────────────────────────────────────────────────── */
export default function LandscapeScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 4, 14], fov: 52, near: 0.1, far: 120 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Fog for depth/atmosphere */}
        <fog attach="fog" args={["#0a160e", 18, 65]} />

        {/* Lighting */}
        <ambientLight intensity={0.15} color="#a8c4a8" />
        <directionalLight position={[10, 20, -5]} intensity={0.6} color="#c8dcc8" />
        <directionalLight position={[-8, 5, 10]} intensity={0.2} color="#1B3A2E" />

        <Sky />
        <Mountains />
        <MountainsFar />
        <Terrain offsetZ={0} color="#1B3A2E" />
        <Terrain2 />
        <Particles />
        <CameraRig />

        <EffectComposer>
          <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.4} />
          <Noise opacity={0.022} />
          <Vignette eskil={false} offset={0.15} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
