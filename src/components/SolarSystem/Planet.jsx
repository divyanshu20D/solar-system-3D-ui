import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";

export function Planet({
  name,
  size,
  color,
  distance,
  speed,
  onSelect,
  texture = null,
}) {
  const meshRef = useRef();
  const orbitRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Orbital motion
    const angle = time * speed;
    orbitRef.current.position.x = Math.cos(angle) * distance;
    orbitRef.current.position.z = Math.sin(angle) * distance;

    // Rotation of the planet itself
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group>
      {/* Orbital Path */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[distance - 0.01, distance + 0.01, 256]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={orbitRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => onSelect({ name, distance, color })}
          >
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 0.5 : 0.1}
              roughness={0.7}
              metalness={0.2}
            />

            {hovered && (
              <Html distanceFactor={15} position={[0, size + 1, 0]}>
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold whitespace-nowrap shadow-xl pointer-events-none">
                  {name}
                </div>
              </Html>
            )}
          </mesh>
        </Float>
      </group>
    </group>
  );
}
