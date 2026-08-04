import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { PALETTES } from '../data/palettes';
import type { PaletteKey } from '../types';

interface Props {
  palette: PaletteKey;
  style?: StyleProp<ViewStyle>;
}

/**
 * Gradient stand-in for real product photography / advisor headshots.
 * Replace with an <Image> once photography is available — see
 * design/handoff/README.md "Assets".
 */
export function PlaceholderSwatch({ palette, style }: Props) {
  const [start, mid, end] = PALETTES[palette] ?? PALETTES.brass;
  return (
    <LinearGradient
      colors={[start, mid, end]}
      start={{ x: 0.2, y: 0.15 }}
      end={{ x: 1, y: 1 }}
      style={style}
    />
  );
}
