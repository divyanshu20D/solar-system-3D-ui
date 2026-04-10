import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, Html } from "@react-three/drei";

// Shader for a detailed, "etched" planet surface
const planetVertexShader = `
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

const planetFragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simple noise for terrain/detail
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
    float n = noise(vPosition * 3.0 + time * 0.05); // Sharper noise
    vec3 finalBase = mix(baseColor, baseColor * 0.2, n);
    
    // Tech lines / Surface cracks
    float lines = step(0.97, sin(vPosition.x * 12.0 + n * 8.0) * sin(vPosition.y * 12.0) * sin(vPosition.z * 12.0));
    vec3 accentColor = mix(vec3(1.0, 1.0, 1.0), baseColor * 2.0, sin(time * 0.1) * 0.5 + 0.5);
    vec3 finalColor = mix(finalBase, accentColor, lines * 0.4);

    // Ultra Sharp Fresnel
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0, 0, 1))), 8.0);
    finalColor += fresnel * vec3(0.6, 0.9, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function DetailedPlanet({
  position = [0, 0, 0],
  scale = 1,
  color = "#44aaff",
}) {
  const planetRef = useRef();
  const instancedRef = useRef();
  const asteroidCount = 1200; // Increased count

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      baseColor: { value: new THREE.Color(color) },
    }),
    [color]
  );

  // Initial rock positions
  const initialRocks = useMemo(() => {
    return Array.from({ length: asteroidCount }, () => ({
      radius: 12 + Math.random() * 6,
      angle: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01,
      y: (Math.random() - 0.5) * 0.8,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      scale: 0.03 + Math.random() * 0.12,
    }));
  }, []);

  const tempObj = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.08;
      planetRef.current.rotation.z = time * 0.03;
    }

    if (instancedRef.current) {
      initialRocks.forEach((rock, i) => {
        const currentAngle = rock.angle + time * rock.speed;
        const x = Math.cos(currentAngle) * rock.radius;
        const z = Math.sin(currentAngle) * rock.radius;

        tempObj.position.set(x, rock.y, z);
        tempObj.rotation.set(
          time * rock.rotationSpeed,
          time * rock.rotationSpeed * 0.5,
          time * rock.rotationSpeed * 2
        );
        tempObj.scale.set(rock.scale, rock.scale, rock.scale);
        tempObj.updateMatrix();
        instancedRef.current.setMatrixAt(i, tempObj.matrix);
      });
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }
    if (uniforms.time) {
      uniforms.time.value = time;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Central Planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[5, 128, 128]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Actual Asteroid Ring using InstancedMesh */}
      <instancedMesh ref={instancedRef} args={[null, null, asteroidCount]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#888"
          roughness={1}
          metalness={0}
          emissive="#111"
        />
      </instancedMesh>

      <pointLight
        intensity={800}
        distance={60}
        color={color}
        position={[15, 5, 10]}
      />
    </group>
  );
}
