// Maison Avenir Design System tokens.
// Warm-neutral palette, no pure black/white, square corners by default,
// hairline borders, no shadows at rest, no gradients/blur/emoji (outside
// of the placeholder product-photo swatches, which use gradients only
// as a stand-in for real photography).

export const colors = {
  canvas: '#F4F1EC',
  paper: '#FAF7F2',
  bone: '#EDE7DD',
  stone: '#C9C0B2',
  clay: '#A89E8C',
  bark: '#6B6357',
  ink: '#2A2622',
  obsidian: '#1A1714',
  persianRed: '#C24A36',
  persianRedPress: '#A33D2C',
  hairline: 'rgba(42,38,34,0.12)',
  hairlineSoft: 'rgba(42,38,34,0.1)',
  cardBorder: '#E2DBD0',
} as const;

export const fonts = {
  display: 'CormorantGaramond_400Regular',
  displayMedium: 'CormorantGaramond_500Medium',
  displaySemiBold: 'CormorantGaramond_600SemiBold',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

export const radii = {
  none: 0,
  input: 4,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const eyebrow = {
  fontFamily: fonts.body,
  fontSize: 11,
  fontWeight: '500' as const,
  letterSpacing: 2.2,
  textTransform: 'uppercase' as const,
  color: colors.clay,
};

export const motion = {
  crossFadeMs: 240,
  easing: [0.32, 0.72, 0.32, 1] as [number, number, number, number],
};
