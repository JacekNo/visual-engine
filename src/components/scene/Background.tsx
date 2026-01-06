import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEngineStore } from '../../store/engineStore';
import { getBrandColorPair } from '../../config/tokens';

// --- VERTEX SHADER (FULLSCREEN CLIP SPACE) ---
// Mnożymy * 2.0, żeby kwadrat 1x1 wypełnił zakres -1 do 1 (cały ekran)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 0.999, 1.0); 
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uSpeed;
  uniform float uWarp;
  uniform float uAspectRatio; 
  varying vec2 vUv;

  float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
  float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Korekta proporcji (żeby szum nie był rozciągnięty)
    vec2 correctedUv = vUv;
    correctedUv.x *= uAspectRatio; 

    vec2 pos = correctedUv * 2.0;
    float n = noise(pos + uTime * uSpeed);
    
    // Aura
    float mixFactor = smoothstep(0.2, 0.8, n + uWarp * sin(correctedUv.x * 10.0 + uTime));
    
    vec3 color = mix(uColorA, uColorB, mixFactor);
    
    // Winieta
    float dist = distance(vUv, vec2(0.5));
    color = mix(color, color * 0.7, dist);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const Background = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { recipe } = useEngineStore((state) => state.payload);
  const { viewport } = useThree(); 
  const { colorA, colorB } = getBrandColorPair(recipe.brandId);

  const motionParams = useMemo(() => {
    switch (recipe.motionProfile) {
      case 'promo_stable': return { speed: 0.1, warp: 0.2 };
      case 'lifestyle_organic': return { speed: 0.4, warp: 0.6 };
      case 'event_energy': return { speed: 0.8, warp: 0.9 };
      default: return { speed: 0.2, warp: 0.3 };
    }
  }, [recipe.motionProfile]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB) },
    uSpeed: { value: motionParams.speed },
    uWarp: { value: motionParams.warp },
    uAspectRatio: { value: 1.0 },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uColorA.value.lerp(colorA, 0.05);
      material.uniforms.uColorB.value.lerp(colorB, 0.05);
      material.uniforms.uSpeed.value = THREE.MathUtils.lerp(material.uniforms.uSpeed.value, motionParams.speed, 0.05);
      material.uniforms.uWarp.value = THREE.MathUtils.lerp(material.uniforms.uWarp.value, motionParams.warp, 0.05);
      material.uniforms.uAspectRatio.value = viewport.width / viewport.height;
    }
  });

  return (
    <mesh ref={meshRef} frustumCulled={false} scale={[1, 1, 1]}>
      <planeGeometry args={[1, 1]} /> 
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        depthWrite={false} 
        depthTest={false} 
      />
    </mesh>
  );
};