// src/store/engineStore.ts
import { create } from 'zustand';
// Zauważ słówko 'type' przy interfejsach, a brak przy DEFAULT_PAYLOAD
import { DEFAULT_PAYLOAD, type RenderPayload, type FormatID, type BrandID } from '../types/schema';

const FORMAT_DIMENSIONS: Record<FormatID, { w: number; h: number }> = {
  'post_1_1': { w: 1080, h: 1080 },
  'story_9_16': { w: 1080, h: 1920 },
  'cover_16_9': { w: 1920, h: 1080 },
};

interface EngineState {
  payload: RenderPayload;
  setBrand: (brand: BrandID) => void;
  setFormat: (format: FormatID) => void;
  updateContent: (field: keyof RenderPayload['content'], value: any) => void;
  randomizeSeed: () => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  payload: DEFAULT_PAYLOAD,

  setBrand: (brand) => set((state) => ({
    payload: { 
      ...state.payload, 
      recipe: { ...state.payload.recipe, brandId: brand } 
    }
  })),

  setFormat: (format) => set((state) => {
    const dims = FORMAT_DIMENSIONS[format];
    return {
      payload: {
        ...state.payload,
        meta: { 
          ...state.payload.meta, 
          format: format, 
          width: dims.w, 
          height: dims.h 
        }
      }
    };
  }),

  updateContent: (field, value) => set((state) => ({
    payload: {
      ...state.payload,
      content: { ...state.payload.content, [field]: value }
    }
  })),

  randomizeSeed: () => set((state) => ({
    payload: {
      ...state.payload,
      recipe: { ...state.payload.recipe, seed: Math.random() }
    }
  })),
}));