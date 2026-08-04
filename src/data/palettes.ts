import type { PaletteKey } from '../types';

// Placeholder gradient swatches standing in for real product photography
// and advisor headshots. Replace every one of these with actual photography
// before shipping — see design/handoff/README.md "Assets".
export const PALETTES: Record<PaletteKey, [string, string, string]> = {
  brass: ['#D4B27A', '#8C6A3A', '#5C4623'],
  linen: ['#E8E0D0', '#C9C0B2', '#A89E8C'],
  oak: ['#C7A988', '#8E6F50', '#523B26'],
  plaster: ['#EDE7DD', '#D8CFC0', '#B8AC97'],
  stone: ['#D6CEC1', '#A89E8C', '#6B6357'],
  ceramic: ['#F0E6D6', '#D2BFA1', '#9A8266'],
  velvet: ['#A33D2C', '#6E2316', '#3A1009'],
};
