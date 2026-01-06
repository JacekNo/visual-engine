// src/types/schema.ts

// --- 1. DOMENY BRANDOWE ---
export type BrandID = 'TM' | 'LO' | 'LP' | 'ED' | 'MIX'; 

// --- 2. KONTEKST MOTION (Fizyka ruchu) ---
export type MotionProfile = 'promo_stable' | 'lifestyle_organic' | 'event_energy';

// --- 3. FORMATY (Wymiary) ---
export type FormatID = 'story_9_16' | 'post_1_1' | 'cover_16_9' | 'portrait_4_5';

// --- 4. SZABLONY UKŁADU ---
export type LayoutVariant = 'neutral_gray' | 'full_color' | 'natural_photo';
// src/types/schema.ts



// ... reszta pliku bez zmian

// --- GŁÓWNY PAYLOAD (To co UI wysyła do Silnika) ---
export interface RenderPayload {
  meta: {
    format: FormatID;
    width: number;
    height: number;
    pixelRatio: number;
  };

  recipe: {
    brandId: BrandID;
    motionProfile: MotionProfile;
    layout: LayoutVariant;
    seed: number;
  };

  content: {
    headline: string;
    subheadline?: string;
    ctaLabel?: string;
    imageBlob?: string;
    
    heroIcon: {
      visible: boolean;
      type: 'signet_logo' | 'icon_scissors' | 'icon_gamepad' | 'none';
      anchor: 'top_right' | 'bottom_center' | 'floating';
    };
  };
}

// --- INITIAL STATE ---
export const DEFAULT_PAYLOAD: RenderPayload = {
  meta: {
    format: 'post_1_1',
    width: 1080,
    height: 1080,
    pixelRatio: 1,
  },
  recipe: {
    brandId: 'TM',
    motionProfile: 'promo_stable',
    layout: 'neutral_gray',
    seed: 12345,
  },
  content: {
    headline: 'Witaj szkoło!',
    subheadline: 'Rekrutacja trwa',
    ctaLabel: 'Zapisz się',
    heroIcon: {
      visible: true,
      type: 'signet_logo',
      anchor: 'top_right',
    },
  },
};