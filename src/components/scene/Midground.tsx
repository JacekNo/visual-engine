import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEngineStore } from '../../store/engineStore';
import { getBrandColorPair } from '../../config/tokens';

const Bubble = ({ position, scale, color, speed, offset }: any) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + offset) * 0.3;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1 + offset) * 0.1;
      mesh.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1 + offset) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial 
        color={color}
        roughness={0.7}
        metalness={0.1}
        transmission={0}
        clearcoat={0.1}
      />
    </mesh>
  );
};

export const Midground = ({ bounds }: { bounds: { width: number, height: number } }) => {
  const { recipe } = useEngineStore((state) => state.payload);
  const { colorB, rimColor } = getBrandColorPair(recipe.brandId);

  const bubbles = useMemo(() => {
    const count = 15;
    const items = [];
    const seed = recipe.seed;

    const random = (idx: number) => {
      const x = Math.sin(seed + idx) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      // Rozrzucamy bąble po CAŁYM widocznym ekranie (+ margines 20%)
      const x = (random(i * 3) - 0.5) * bounds.width * 1.2;
      const y = (random(i * 3 + 1) - 0.5) * bounds.height * 1.2;
      
      // Unikanie środka (gdzie jest tekst)
      const dist = Math.sqrt(x*x + y*y);
      const safeZone = 4.0; 
      
      const safeX = dist < safeZone ? x + (x > 0 ? safeZone : -safeZone) : x;
      const safeY = dist < safeZone ? y + (y > 0 ? safeZone : -safeZone) : y;

      const scale = 0.8 + random(i * 7) * 1.7; 

      items.push({
        position: [safeX, safeY, random(i) * 6 - 3], // Głębokość
        scale: [scale, scale, scale],
        speed: 0.3 + random(i) * 0.4,
        offset: random(i) * 10,
      });
    }
    return items;
  }, [recipe.seed, bounds.width, bounds.height]);

  return (
    <group>
      {bubbles.map((data, i) => (
        <Bubble 
          key={i} 
          {...data} 
          color={i % 2 === 0 ? colorB : rimColor} 
        />
      ))}
    </group>
  );
};