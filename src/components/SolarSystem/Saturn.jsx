import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// High-detail Saturn Surface Shader (Merging bands with fine grain)
const saturnVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const saturnFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
               mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
               mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }

  void main() {
    // Sharp banded atmosphere
    float noise1 = noise(vPosition * 2.0 + time * 0.1);
    float bands = sin(vUv.y * 30.0 + noise1 * 5.0) * 0.5 + 0.5;
    
    vec3 color1 = vec3(0.8, 0.7, 0.4); // Saturn Beige
    vec3 color2 = vec3(0.6, 0.5, 0.3); // Saturn Tan
    vec3 finalBase = mix(color1, color2, bands);
    
    // Tech-detailing from DetailedPlanet
    float lines = step(0.985, sin(vPosition.x * 15.0 + noise1 * 8.0) * sin(vPosition.y * 15.0));
    finalBase = mix(finalBase, vec3(1.0, 0.9, 0.6), lines * 0.3);

    // Ultra Sharp Fresnel
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0, 0, 1))), 8.0);
    finalBase += fresnel * vec3(0.5, 0.4, 0.2);

    gl_FragColor = vec4(finalBase, 1.0);
  }
`;

export function Saturn({ position = [0, 0, 0], scale = 1 }) {
  const planetRef = useRef();
  const instancedRef = useRef();
  const asteroidCount = 1800; // High density for Saturn's rings

  // Initial rock positions for a flat, dense ring
  const initialRocks = useMemo(() => {
    return Array.from({ length: asteroidCount }, () => ({
      radius: 7.5 + Math.random() * 5.5, // Ring width
      angle: Math.random() * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.008,
      y: (Math.random() - 0.5) * 0.15, // Very flat ring
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      scale: 0.02 + Math.random() * 0.08,
    }));
  }, []);

  const tempObj = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.05;
    }

    if (instancedRef.current) {
      initialRocks.forEach((rock, i) => {
        const currentAngle = rock.angle + time * rock.speed;
        const x = Math.cos(currentAngle) * rock.radius;
        const z = Math.sin(currentAngle) * rock.radius;

        tempObj.position.set(x, rock.y, z);
        tempObj.rotation.set(
          time * rock.rotationSpeed,
          time * rock.rotationSpeed,
          time * rock.rotationSpeed
        );
        tempObj.scale.set(rock.scale, rock.scale, rock.scale);
        tempObj.updateMatrix();
        instancedRef.current.setMatrixAt(i, tempObj.matrix);
      });
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={position} scale={scale} rotation={[0.4, 0, 0.2]}>
      {/* Saturn Body */}
      <mesh ref={planetRef} castShadow>
        <sphereGeometry args={[5, 128, 128]} />
        <shaderMaterial
          vertexShader={saturnVertexShader}
          fragmentShader={saturnFragmentShader}
          uniforms={{ time: { value: 0 } }}
        />
      </mesh>

      {/* High-Detail Asteroid Ring (Replacing flat geometry) */}
      <instancedMesh
        ref={instancedRef}
        args={[null, null, asteroidCount]}
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#aa9988"
          roughness={1}
          metalness={0}
          emissive="#111"
        />
      </instancedMesh>

      {/* Subliminal faint light glow for the ring area */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[7.4, 13.1, 128]} />
        <meshBasicMaterial
          color="#ffccaa"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>

      <directionalLight intensity={2.5} position={[10, 5, 10]} castShadow />
    </group>
  );
}
