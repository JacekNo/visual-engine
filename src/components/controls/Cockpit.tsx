import { useEngineStore } from '../../store/engineStore';
import type { BrandID, FormatID } from '../../types/schema';


export const Cockpit = () => {
  // Pobieramy akcje i stan
  const { 
    setBrand, 
    setFormat, 
    updateContent,
    randomizeSeed,
    payload 
  } = useEngineStore();

  return (
    <div className="w-[400px] bg-white border-r border-zinc-200 h-screen overflow-y-auto p-6 flex flex-col gap-8 shadow-xl z-10">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">TEB Engine</h2>
        <p className="text-sm text-zinc-500">v0.1.0 Walking Skeleton</p>
      </div>

      {/* SEKCJA 1: KONTEKST */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Konfiguracja</h3>
        
        {/* Wybór Formatu */}
          <div className="grid grid-cols-2 gap-2"> {/* Zmieniamy grid-cols-3 na 2, żeby ładnie się układało */}
            {(['post_1_1', 'story_9_16', 'cover_16_9', 'portrait_4_5'] as FormatID[]).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`p-2 text-xs rounded border transition-colors ${
                        payload.meta.format === fmt 
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                >
                    {fmt.replace(/_/g, ' ')}
                </button>
            ))}
        </div>

        {/* Wybór Brandu */}
        <select 
            value={payload.recipe.brandId}
            onChange={(e) => setBrand(e.target.value as BrandID)}
            className="w-full p-2 border border-zinc-200 rounded text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="TM">Technikum (TM)</option>
            <option value="LO">Liceum (LO)</option>
            <option value="LP">Plastyk (LP)</option>
            <option value="ED">Edukacja (ED)</option>
            <option value="MIX">MIX (TM/LO)</option>
        </select>
      </section>

      {/* Wybór Motion Profile */}
      <div className="mt-4 space-y-2">
          <label className="text-xs font-medium text-zinc-600">Dynamika Ruchu</label>
          <div className="flex gap-2">
              {(['promo_stable', 'lifestyle_organic'] as const).map(profile => (
                  <button
                      key={profile}
                      onClick={() => {
                          // Tutaj mały hack, bo w store nie zrobiliśmy dedykowanej akcji setMotionProfile
                          // ale mamy randomizeSeed, który odświeża stan. 
                          // Właściwie powinniśmy dodać setMotionProfile do Store, ale zróbmy to manualnie:
                          useEngineStore.setState(state => ({
                              payload: { ...state.payload, recipe: { ...state.payload.recipe, motionProfile: profile } }
                          }))
                      }}
                      className={`flex-1 p-2 text-xs border rounded ${
                          payload.recipe.motionProfile === profile ? 'bg-zinc-800 text-white' : 'bg-white'
                      }`}
                  >
                      {profile === 'promo_stable' ? 'Spokojny' : 'Żywy'}
                  </button>
              ))}
          </div>
      </div>

      {/* SEKCJA 2: TREŚĆ */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Treść</h3>
        
        <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600">Nagłówek</label>
            <input 
                type="text"
                value={payload.content.headline}
                onChange={(e) => updateContent('headline', e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded text-sm focus:outline-none focus:border-blue-500"
            />
        </div>

        <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-600">Podtytuł</label>
            <input 
                type="text"
                value={payload.content.subheadline || ''}
                onChange={(e) => updateContent('subheadline', e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded text-sm focus:outline-none focus:border-blue-500"
            />
        </div>
      </section>

      {/* SEKCJA 3: GENERATOR */}
      <section className="pt-4 border-t border-zinc-100">
        <button 
            onClick={randomizeSeed}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-lg active:scale-95 transition-transform"
        >
            Generuj Wariant ✨
        </button>
        <p className="text-center text-xs text-zinc-400 mt-2 font-mono">
            Seed: {payload.recipe.seed.toFixed(6)}
        </p>
      </section>

    </div>
  );
};