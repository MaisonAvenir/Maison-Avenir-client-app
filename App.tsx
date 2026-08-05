import {
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { isShopifyConfigured } from './src/config/shopify';
import { AppStateProvider } from './src/context/AppStateContext';
import { RootTabs } from './src/navigation/RootTabs';
import { LoginScreen } from './src/screens/LoginScreen';
import { colors } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    card: colors.paper,
    border: colors.hairline,
    primary: colors.persianRed,
    text: colors.ink,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_500Medium_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="dark" />
            <AuthGate />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </View>
  );
}

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();

  // Until Shopify credentials are filled in (src/config/shopify.ts), run with demo data
  // so the app is still usable for design/dev without requiring sign-in.
  if (!isShopifyConfigured()) {
    return (
      <AppStateProvider>
        <RootTabs />
      </AppStateProvider>
    );
  }

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: colors.canvas }} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <AppStateProvider>
      <RootTabs />
    </AppStateProvider>
  );
}
