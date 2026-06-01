"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import { interpolate } from "remotion";

/* ─── Colors match the mont-fort screenshot ─────────────────────── */
const SKY    = new THREE.Color("#EBEEf3");  // pale blue-grey sky
const PEAK   = new THREE.Color("#F4F7FA");  // near-white snow peak
const SHADOW = new THREE.Color("#C8D4E0");  // blue-grey mountain shadow
const CLOUD  = new THREE.Color("#FFFFFF");  // pure white clouds

/* ── Sky gradient ────────────────────────────────────────────────── */
function Sky() {
  const vert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
  const frag = `varying vec2 vUv;
    void main(){
      vec3 top   = vec3(0.88,0.91,0.96);  // pale grey-blue top
      vec3 horiz = vec3(0.97,0.98,1.00);  // almost white horizon
      vec3 col   = mix(top, horiz, smoothstep(0.3,0.85,vUv.y));
      gl_FragColor = vec4(col,1.);
    }`;
  return (
    <mesh position={[0,0,-100]} renderOrder={-1}>
      <planeGeometry args={[400,160]}/>
      <shaderMaterial vertexShader={vert} fragmentShader={frag} depthWrite={false}/>
    </mesh>
  );
}

/* ── Mountain ridge — white snowy peak ──────────────────────────── */
function Peak({ z, sx=1, sy=1, op=1, color="#F4F7FA" }: { z:number; sx?:number; sy?:number; op?:number; color?:string }) {
  const noise = useMemo(() => createNoise2D(), []);
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [new THREE.Vector2(-80,-4)];
    for (let x=-80; x<=80; x+=0.5) {
      const y =
        noise(x*0.018*sx,0)*20*sy +
        noise(x*0.055*sx,0)*5*sy  +
        noise(x*0.18*sx,0)*1.5*sy + 3*sy;
      pts.push(new THREE.Vector2(x,y));
    }
    pts.push(new THREE.Vector2(80,-4));
    return new THREE.ShapeGeometry(new THREE.Shape(pts));
  }, [noise,sx,sy]);
  return (
    <mesh geometry={geo} position={[0,0,z]} renderOrder={2}>
      <meshBasicMaterial color={color} transparent opacity={op} side={THREE.DoubleSide}/>
    </mesh>
  );
}

/* ── Dense white cloud layer ─────────────────────────────────────── */
function CloudLayer({ y, count=5000, size=2.5, op=0.7 }: { y:number; count?:number; size?:number; op?:number }) {
  const ref = useRef<THREE.Points>(null);
  const pts = useMemo(() => {
    const a = new Float32Array(count*3);
    for (let i=0; i<count; i++) {
      a[i*3]   = (Math.random()-0.5)*300;
      a[i*3+1] = (Math.random()-0.5)*14;
      a[i*3+2] = (Math.random()-0.5)*300;
    }
    return a;
  }, [count]);
  useFrame(s => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime*0.004; });
  return (
    <points ref={ref} position={[0,y,0]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pts,3]}/></bufferGeometry>
      <pointsMaterial size={size} color={CLOUD} transparent opacity={op} sizeAttenuation depthWrite={false}/>
    </points>
  );
}

/* ── Thin mist plane ─────────────────────────────────────────────── */
function MistPlane({ y, op=0.5 }: { y:number; op?:number }) {
  return (
    <mesh position={[0,y,-10]}>
      <planeGeometry args={[400,20]}/>
      <meshBasicMaterial color={CLOUD} transparent opacity={op} side={THREE.DoubleSide} depthWrite={false}/>
    </mesh>
  );
}

/* ── Camera movement tied to scroll ─────────────────────────────── */
function CameraRig({ progress }: { progress:number }) {
  const { camera } = useRef<{ camera: THREE.Camera }>({ camera: null! }).current ?? {};

  useFrame((state, _delta) => {
    const t = state.clock.elapsedTime;
    const p = progress;

    // Camera slowly drifts — from above-clouds looking at peaks, to lower position
    const camY = interpolate(p, [0, 0.5, 1], [8, 4, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
    const camZ = interpolate(p, [0, 1], [20, 45], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
    const fov  = interpolate(p, [0, 1], [46, 55], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });

    state.camera.position.set(
      Math.sin(t*0.06)*1.5,
      camY + Math.sin(t*0.1)*0.2,
      camZ
    );
    (state.camera as THREE.PerspectiveCamera).fov = fov;
    state.camera.updateProjectionMatrix();
    state.camera.lookAt(0, camY - 2, -10);
  });

  return null;
}

/* ── Main scene ──────────────────────────────────────────────────── */
function SceneInner({ progress }: { progress:number }) {
  return (
    <>
      <fog attach="fog" args={["#EBEEf3", 40, 160]}/>
      <color attach="background" args={["#EBEEf3"]}/>

      {/* Soft lighting — overcast alpine */}
      <ambientLight intensity={1.8} color="#E8ECF2"/>
      <directionalLight position={[20,40,10]} intensity={0.6} color="#FFFFFF"/>
      <directionalLight position={[-15,20,-10]} intensity={0.3} color="#D8E0EC"/>

      <Sky/>

      {/* Mountain peaks — lightest (furthest) to darkest (nearest) */}
      {/* Far range — very faint, barely visible */}
      <Peak z={-85} sx={1.4} sy={1.5} op={0.25} color="#DCE4EE"/>
      <Peak z={-65} sx={1.1} sy={1.3} op={0.42} color="#E4EAF2"/>
      {/* Mid range */}
      <Peak z={-45} sx={0.9} sy={1.1} op={0.62} color="#EDF1F7"/>
      <Peak z={-32} sx={0.8} sy={0.95} op={0.78} color="#F2F5FA"/>
      {/* Foreground peaks — bright white */}
      <Peak z={-20} sx={0.7} sy={0.85} op={0.90} color="#F8FAFE"/>
      <Peak z={-10} sx={0.6} sy={0.7}  op={0.95} color="#FFFFFF"/>

      {/* Dense cloud layers around mid-peaks */}
      <CloudLayer y={6}  count={6000} size={3.5} op={0.85}/>
      <CloudLayer y={3}  count={8000} size={2.8} op={0.7}/>
      <CloudLayer y={0}  count={5000} size={4.0} op={0.55}/>
      <CloudLayer y={-3} count={4000} size={2.2} op={0.4}/>

      {/* Mist planes */}
      <MistPlane y={4}  op={0.45}/>
      <MistPlane y={1}  op={0.55}/>
      <MistPlane y={-2} op={0.35}/>

      <CameraRig progress={progress}/>

      <EffectComposer>
        <DepthOfField focusDistance={0.01} focalLength={0.04} bokehScale={3}/>
        <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} intensity={0.2}/>
        <Noise opacity={0.018}/>
        <Vignette eskil={false} offset={0.1} darkness={0.25}/>
      </EffectComposer>
    </>
  );
}

export default function MountainScene({ progress }: { progress:number }) {
  return (
    <Canvas
      camera={{ position:[0,8,20], fov:46, near:0.5, far:300 }}
      dpr={[1,1.5]}
      gl={{ antialias:true, alpha:false }}
    >
      <SceneInner progress={progress}/>
    </Canvas>
  );
}
