import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { colors, fonts } from '../theme/tokens';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
}

export function Eyebrow({ children, style, color = colors.clay, size = 11, align = 'left' }: Props) {
  return (
    <Text
      style={[
        styles.base,
        { color, fontSize: size, letterSpacing: size * 0.2, textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fonts.bodyMedium,
    textTransform: 'uppercase',
  },
});
