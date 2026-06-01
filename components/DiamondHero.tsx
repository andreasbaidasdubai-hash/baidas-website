"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function Diamond() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.28;
    ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.22) * 0.1;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
      <mesh ref={ref}>
        <octahedronGeometry args={[1.7, 0]} />
        <MeshDistortMaterial
          color="#c8c2b4"
          emissive="#1B3A2E"
          emissiveIntensity={0.08}
          roughness={0.06}
          metalness={0.88}
          distort={0.06}
          speed={1.2}
          transparent
          opacity={0.97}
        />
      </mesh>
      {/* Delicate wireframe halo */}
      <mesh>
        <octahedronGeometry args={[2.05, 0]} />
        <meshBasicMaterial color="#1B3A2E" transparent opacity={0.018} wireframe />
      </mesh>
    </Float>
  );
}

function Ring({ r, t, rot, spd }: { r: number; t: number; rot: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * spd; });
  return (
    <mesh ref={ref} rotation={rot}>
      <torusGeometry args={[r, t, 16, 120]} />
      <meshBasicMaterial color="#1B3A2E" transparent opacity={0.12} />
    </mesh>
  );
}

export default function DiamondHero() {
  return (
    <Canvas camera={{ position: [0, 0, 5.8], fov: 44 }} dpr={[1, 2]}>
      <ambientLight intensity={0.7} color="#f5f0e8" />
      <pointLight position={[6, 6, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, -2, -2]} intensity={0.8} color="#d4c8b0" />
      <pointLight position={[1, -5, 3]} intensity={0.4} color="#1B3A2E" />
      <Environment preset="apartment" />
      <Diamond />
      <Ring r={2.9} t={0.008} rot={[Math.PI / 2, 0, 0]} spd={0.18} />
      <Ring r={3.6} t={0.005} rot={[Math.PI / 3.5, 0.5, 0]} spd={-0.12} />
    </Canvas>
  );
}
