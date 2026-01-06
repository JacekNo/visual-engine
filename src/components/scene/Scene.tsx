import { OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Background } from './Background';
import { Midground } from './Midground'; 

// Stała gęstość: 100px na ekranie to 1 jednostka w 3D.
// Dzięki temu obiekty 3D nie zmieniają wielkości przy zmianie rozmiaru okna.
const PIXELS_PER_UNIT = 100;

export const Scene = () => {
  // Pobieramy wymiary CAŁEGO OBSZARU ROBOCZEGO (nie formatu!)
  const { size } = useThree(); 

  const viewWidth = size.width / PIXELS_PER_UNIT;
  const viewHeight = size.height / PIXELS_PER_UNIT;

  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[0, 0, 10]}
        zoom={1}
        near={-100}
        far={100}
        // Kamera widzi cały dostępny obszar roboczy
        left={-viewWidth / 2}
        right={viewWidth / 2}
        top={viewHeight / 2}
        bottom={-viewHeight / 2}
      />

      {/* Tło full-screen */}
      <Background />
      
      {/* Przekazujemy globalne wymiary, żeby bąble latały po całym ekranie */}
      <Midground bounds={{ width: viewWidth, height: viewHeight }} />

      {/* Oświetlenie */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, 5]} intensity={0.5} color="#ffffff" />
    </>
  );
};