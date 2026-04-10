import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { DetailedPlanet } from "./DetailedPlanet";
import { Saturn } from "./Saturn";
import gsap from "gsap";

const planetsData = [
  { name: "Mercury", size: 0.4, color: "#A5A5A5", distance: 8, speed: 0.4 },
  { name: "Venus", size: 0.9, color: "#E3BB76", distance: 11, speed: 0.25 },
  { name: "Earth", size: 1, color: "#2271B3", distance: 15, speed: 0.2 },
  { name: "Mars", size: 0.5, color: "#E27B58", distance: 19, speed: 0.15 },
  { name: "Jupiter", size: 2.2, color: "#D39C7E", distance: 26, speed: 0.08 },
  { name: "Saturn", size: 1.8, color: "#C5AB6E", distance: 33, speed: 0.05 },
  { name: "Uranus", size: 1.2, color: "#B5E3E3", distance: 40, speed: 0.03 },
  { name: "Neptune", size: 1.1, color: "#6081FF", distance: 46, speed: 0.02 },
];

function CameraController({ selectedPlanet }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (selectedPlanet) {
      // Zoom to planet
      gsap.to(camera.position, {
        x: selectedPlanet.distance + 5,
        y: 5,
        z: selectedPlanet.distance + 5,
        duration: 2,
        ease: "power3.inOut",
      });
      if (controls) {
        gsap.to(controls.target, {
          x: selectedPlanet.distance,
          y: 0,
          z: 0,
          duration: 2,
          ease: "power3.inOut",
        });
      }
    } else {
      // Reset camera
      gsap.to(camera.position, {
        x: 30,
        y: 20,
        z: 30,
        duration: 2,
        ease: "power3.inOut",
      });
      if (controls) {
        gsap.to(controls.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 2,
          ease: "power3.inOut",
        });
      }
    }
  }, [selectedPlanet, camera, controls]);

  return null;
}

export function Scene({ onSelectPlanet, selectedPlanet }) {
  return (
    <Canvas
      shadows
      className="w-full h-full bg-space-900"
      dpr={[1, 2]} // Use high pixel ratio for high-DPI screens
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      }}
    >
      <PerspectiveCamera makeDefault position={[30, 20, 30]} fov={45} />
      <OrbitControls
        enablePan={false}
        maxDistance={100}
        minDistance={5}
        enableZoom={false} // Disable wheel zoom to allow page scrolling
        makeDefault
      />

      <ambientLight intensity={0.1} />
      {/* Enhanced Stars with subtle movement */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* <Sun /> */}

      {/* Cinematic Saturn Focal Point */}
      <Saturn position={[0, 0, -15]} scale={1.8} />

      {/* Background Detailed Planets for depth (distant) */}
      <DetailedPlanet position={[-80, 20, -60]} scale={1.5} color="#ff44aa" />
      <DetailedPlanet position={[70, -30, -80]} scale={1.8} color="#ffcc33" />

      {/* 
      {planetsData.map((planet) => (
        <Planet key={planet.name} {...planet} onSelect={onSelectPlanet} />
      ))} 
      */}

      {/* <CameraController selectedPlanet={selectedPlanet} /> */}

      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom
          luminanceThreshold={1.5} // Increased threshold for less "spread"
          mipmapBlur
          intensity={1.0} // Slightly reduced intensity
          radius={0.3} // Smaller radius for tighter glow
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
