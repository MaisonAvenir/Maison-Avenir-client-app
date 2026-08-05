import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/tokens';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Paper background, hairline bottom border, safe-area-aware top padding — shared by every tab's header. */
export function ScreenHeader({ children, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.base, { paddingTop: insets.top + 14 }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    backgroundColor: colors.paper,
  },
});
