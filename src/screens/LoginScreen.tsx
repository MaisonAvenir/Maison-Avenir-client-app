import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Eyebrow } from '../components/Eyebrow';
import { useAuth } from '../auth/AuthContext';
import { colors, fonts } from '../theme/tokens';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, authError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await login();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 }]}>
      <View style={styles.body}>
        <Eyebrow align="center" size={11}>
          Avenir Privé
        </Eyebrow>
        <Text style={styles.title}>Welcome back.</Text>
        <Text style={styles.subtitle}>
          Sign in with the email address on your Maison Avenir account to see your purchase history and the
          pieces your advisor has picked for you.
        </Text>
      </View>

      <View style={styles.footer}>
        {authError && <Text style={styles.error}>{authError}</Text>}
        <Pressable
          onPress={handleSignIn}
          disabled={isSigningIn}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, isSigningIn && styles.buttonDisabled]}
        >
          {isSigningIn ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Text style={styles.buttonText}>Sign In with Email</Text>
          )}
        </Pressable>
        <Text style={styles.hint}>We'll send a one-time code to your email — no password needed.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  body: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 32,
    color: colors.obsidian,
    marginTop: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.bark,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 320,
  },
  footer: {
    alignItems: 'center',
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.persianRed,
    textAlign: 'center',
    marginBottom: 14,
  },
  button: {
    width: '100%',
    backgroundColor: colors.persianRed,
    borderWidth: 1,
    borderColor: colors.persianRed,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.persianRedPress,
    borderColor: colors.persianRedPress,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: colors.paper,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.clay,
    textAlign: 'center',
    marginTop: 14,
  },
});
