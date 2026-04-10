import { Stars as DreiStars } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function Stars() {
  const starsRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    starsRef.current.rotation.y = time * 0.01;
    starsRef.current.rotation.z = time * 0.005;
  });

  return (
    <DreiStars
      ref={starsRef}
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}
