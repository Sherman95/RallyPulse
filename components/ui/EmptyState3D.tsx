"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function CheckeredFlag() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Tamaño de la bandera
  const cols = 12;
  const rows = 8;
  const cubeSize = 0.25;

  // Generar la matriz de cubos
  const cubes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isBlack = (r + c) % 2 === 0;
      cubes.push({
        id: `${r}-${c}`,
        row: r,
        col: c,
        color: isBlack ? "#111111" : "#eeeeee"
      });
    }
  }

  useFrame((state) => {
    if (groupRef.current) {
      // Rotación suave global
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 - 0.5;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;

      // Ondulación (efecto de viento) para cada cubo (saltando el primer hijo que es el asta)
      groupRef.current.children.forEach((child, i) => {
        if (i === 0) return; // Saltar el asta
        const cubeIndex = i - 1;
        if (!cubes[cubeIndex]) return;
        
        const c = cubes[cubeIndex].col;
        const r = cubes[cubeIndex].row;
        // Función de onda basada en la columna y el tiempo
        const wave = Math.sin(c * 0.5 - state.clock.elapsedTime * 3) * 0.3;
        // Añadimos un poco de caos vertical en los bordes
        const waveY = Math.cos(c * 0.3 - state.clock.elapsedTime * 2) * 0.1;
        
        child.position.z = wave;
        // Posición base + ondulación Y
        child.position.y = (r - rows / 2) * cubeSize + waveY;
      });
    }
  });

  return (
    <group ref={groupRef} position={[-cols * cubeSize * 0.5, 0, 0]}>
      {/* Asta de la bandera */}
      <mesh position={[-0.3, -1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cubos de la bandera a cuadros */}
      {cubes.map((cube) => (
        <mesh 
          key={cube.id} 
          position={[cube.col * cubeSize, (cube.row - rows / 2) * cubeSize, 0]}
        >
          <boxGeometry args={[cubeSize * 0.95, cubeSize * 0.95, cubeSize * 0.2]} />
          <meshStandardMaterial 
            color={cube.color} 
            metalness={0.1} 
            roughness={0.4} 
          />
        </mesh>
      ))}
    </group>
  );
}

export default function EmptyState3D() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[350px] relative">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Float 
            speed={2} 
            rotationIntensity={0.5} 
            floatIntensity={1} 
            floatingRange={[-0.1, 0.1]}
          >
            <CheckeredFlag />
          </Float>
          
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
            color="#000000"
          />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      <div className="z-10 mt-48 text-center pointer-events-none">
        <p className="text-rally-muted text-sm tracking-widest uppercase font-bold bg-rally-bg/60 backdrop-blur-sm px-4 py-1 rounded-full border border-white/5 inline-block">
          Categoría Vacía
        </p>
        <p className="text-rally-muted/80 text-xs mt-3 max-w-[200px] mx-auto bg-rally-bg/60 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          No hay pilotos registrados o cronometrados aquí aún.
        </p>
      </div>
    </div>
  );
}
