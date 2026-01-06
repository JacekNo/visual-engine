import * as THREE from 'three';
import type { BrandID } from '../types/schema';

// 1. TWOJE DANE (Oryginalna struktura z pliku)
export type PaletteKey = 'TECHNIKUM' | 'LICEUM' | 'PLASTYCZNE' | 'DOMOWA' | 'MIX';

export const PALETTES: Record<PaletteKey, { base: string; mid: string; rim: string }[]> = {
  // TM - Technikum (#C51523 -> #FF545E)
  TECHNIKUM: [
    { base: '#C51523', mid: '#FF545E', rim: '#FF545E' }
  ],
  // LO - Liceum (#0085B7 -> #40B6FF)
  LICEUM: [
    { base: '#0085B7', mid: '#40B6FF', rim: '#40B6FF' }
  ],
  // LP - Plastyczne (#A43282 -> #DD48B1)
  PLASTYCZNE: [
    { base: '#A43282', mid: '#DD48B1', rim: '#DD48B1' }
  ],
  // ED - Edukacja Domowa (#0941A1 -> #1E53E5)
  DOMOWA: [
    { base: '#0941A1', mid: '#1E53E5', rim: '#1E53E5' }
  ],
  // MIX - Losuje z powyższych
  MIX: [
    { base: '#C51523', mid: '#FF545E', rim: '#FF545E' }, // TM
    { base: '#0085B7', mid: '#40B6FF', rim: '#40B6FF' }, // LO
    { base: '#A43282', mid: '#DD48B1', rim: '#DD48B1' }, // LP
    { base: '#0941A1', mid: '#1E53E5', rim: '#1E53E5' }  // ED
  ]
};

// 2. MOST (Mapowanie ID na Klucze Palety)
const BRAND_MAP: Record<BrandID, PaletteKey> = {
  'TM': 'TECHNIKUM',
  'LO': 'LICEUM',
  'LP': 'PLASTYCZNE',
  'ED': 'DOMOWA',
  'MIX': 'MIX' // Tutaj obsłużymy to specjalnie
};

// 3. Helper dla Shadera i Bąbli
// Zwraca kolory w formacie zrozumiałym dla Three.js
export const getBrandColorPair = (brandId: BrandID) => {
  const key = BRAND_MAP[brandId];
  const paletteData = PALETTES[key];

  // Logika dla MIX: Bierzemy kolor bazowy z TM i kolor bazowy z LO dla kontrastu
  if (brandId === 'MIX') {
    return {
      colorA: new THREE.Color(PALETTES.TECHNIKUM[0].base), // Czerwony
      colorB: new THREE.Color(PALETTES.LICEUM[0].base),    // Niebieski
      rimColor: new THREE.Color('#ffffff') // Neutralny rim
    };
  }

  // Logika dla pojedynczych brandów:
  // colorA = base (Ciemniejszy/Główny)
  // colorB = mid (Jaśniejszy/Gradient)
  return {
    colorA: new THREE.Color(paletteData[0].base),
    colorB: new THREE.Color(paletteData[0].mid),
    rimColor: new THREE.Color(paletteData[0].rim) // Przyda się później do bąbli 3D
  };
};