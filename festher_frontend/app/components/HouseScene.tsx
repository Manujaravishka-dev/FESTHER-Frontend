"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Window({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return <mesh position={position} scale={scale}><boxGeometry /><meshPhysicalMaterial color="#1c2525" roughness={0.12} metalness={0.25} transmission={0.12} /></mesh>;
}

function House() {
  const house = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!house.current) return;
    house.current.rotation.x = THREE.MathUtils.lerp(house.current.rotation.x, state.pointer.y * 0.07, 0.035);
    house.current.rotation.y = THREE.MathUtils.lerp(house.current.rotation.y, state.pointer.x * 0.11 - 0.32, 0.035);
  });
  const plants: [number, number, number][] = [[-1.85, -1.02, 1.48], [-1.55, -1.02, 1.64], [1.8, -1.02, 1.58]];
  return (
    <Float speed={1.25} rotationIntensity={0.025} floatIntensity={0.12}>
      <group ref={house} rotation={[0, -0.32, 0]} position={[0, -0.15, 0]}>
        <RoundedBox args={[4.8, 0.22, 3.3]} radius={0.05} position={[0, -1.22, 0]} castShadow><meshStandardMaterial color="#c4a27b" roughness={0.85} /></RoundedBox>
        <RoundedBox args={[4.15, 1.65, 2.6]} radius={0.04} position={[0, -0.32, 0]} castShadow receiveShadow><meshStandardMaterial color="#e7dfd3" roughness={0.82} /></RoundedBox>
        <RoundedBox args={[2.65, 1.38, 2.25]} radius={0.035} position={[0.48, 1.18, -0.1]} castShadow><meshStandardMaterial color="#d8c9b6" roughness={0.8} /></RoundedBox>
        <mesh position={[0.55, 1.93, -0.05]} castShadow><boxGeometry args={[3.15, 0.14, 2.75]} /><meshStandardMaterial color="#373934" roughness={0.72} /></mesh>
        <mesh position={[-0.35, 0.48, 1.37]} castShadow><boxGeometry args={[4.85, 0.16, 0.35]} /><meshStandardMaterial color="#4a4b45" roughness={0.7} /></mesh>
        <Window position={[-1.22, -0.24, 1.315]} scale={[1.2, 1.05, 0.05]} /><Window position={[0.4, -0.24, 1.315]} scale={[1.45, 1.05, 0.05]} /><Window position={[0.49, 1.15, 1.04]} scale={[1.75, 0.82, 0.05]} />
        <mesh position={[1.62, -0.36, 1.32]}><boxGeometry args={[0.7, 1.45, 0.08]} /><meshStandardMaterial color="#8a5e3f" roughness={0.55} /></mesh>
        {plants.map((position, index) => <group position={position} key={index}><mesh position={[0, 0.23, 0]}><cylinderGeometry args={[0.1, 0.14, 0.46, 12]} /><meshStandardMaterial color="#80634b" /></mesh><mesh position={[0, 0.62, 0]} castShadow><sphereGeometry args={[0.42, 18, 18]} /><meshStandardMaterial color={index === 2 ? "#789069" : "#637d59"} roughness={1} /></mesh></group>)}
      </group>
    </Float>
  );
}

export default function HouseScene() {
  return <Canvas shadows dpr={[1, 1.7]} camera={{ position: [5.2, 3.3, 7.4], fov: 34 }} gl={{ antialias: true }}><color attach="background" args={["#ddd7cc"]} /><fog attach="fog" args={["#ddd7cc", 10, 18]} /><ambientLight intensity={1.1} /><directionalLight position={[4, 7, 5]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} /><House /><ContactShadows position={[0, -1.38, 0]} opacity={0.38} scale={8} blur={2.5} far={3.8} /><Environment preset="apartment" /></Canvas>;
}
