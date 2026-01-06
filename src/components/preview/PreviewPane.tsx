import { Canvas } from '@react-three/fiber';
import { useEngineStore } from '../../store/engineStore';
import { Scene } from '../scene/Scene';

export const PreviewPane = () => {
  const { meta, content } = useEngineStore((state) => state.payload);

  // Skala podglądu formatu (żeby ramka nie była za duża na ekranie laptopa)
  const previewScale = 0.45; 

  return (
    // KONTENER GŁÓWNY (Cały prawy panel)
    <div className="flex-1 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
       
      {/* WARSTWA 0: ŚWIAT 3D (GLOBALNA TAPETA) 
          Canvas zajmuje 100% panelu, niezależnie od wybranego formatu.
      */}
      <div className="absolute inset-0 z-0">
        <Canvas>
            <Scene />
        </Canvas>
      </div>

      {/* WARSTWA 1: RAMKA FORMATU (WIZJER) 
          To jest nasza "kartka" położona na stole 3D.
      */}
      <div 
        style={{
            width: meta.width * previewScale,
            height: meta.height * previewScale
        }}
        className="relative z-10 shadow-2xl transition-all duration-500 ease-in-out"
      >
        {/* Wnętrze ramki - tutaj skalujemy treść HTML i obrys */}
        <div 
            style={{
                width: meta.width,
                height: meta.height,
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
            }}
            // Border pokazuje granice formatu (kadrowanie)
            className="absolute top-0 left-0 border-4 border-white/20 box-border overflow-hidden"
        >
            {/* Treść Tekstowa (HTML Overlay) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-20 pointer-events-none">
                <h1 className="text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-none drop-shadow-xl">
                    {content.headline}
                </h1>
                
                {content.subheadline && (
                    <p className="text-4xl font-medium text-zinc-800 bg-white/90 px-6 py-2 rounded-full shadow-lg">
                        {content.subheadline}
                    </p>
                )}
            </div>

            {/* Znaczniki cięcia (rogi - wizualny bajer) */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white opacity-50"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white opacity-50"></div>
        </div>
      </div>

      {/* Info debugowe na dole */}
      <div className="absolute bottom-4 left-4 text-zinc-600 text-xs font-mono z-20">
        Mode: Virtual Tabletop | Frame: {meta.width}x{meta.height}
      </div>
    </div>
  );
};