import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { AUTH_REDIRECT_URI } from '../config/shopify';
import {
  buildAuthorizationRequest,
  exchangeCodeForTokens,
  parseCodeFromRedirectUrl,
  refreshTokens,
  type TokenResponse,
} from './shopifyAuth';

const STORAGE_KEY = 'avenir_prive.shopify_session';
// Refresh a little before actual expiry so in-flight requests don't race the clock.
const EXPIRY_SAFETY_MARGIN_MS = 60_000;

interface StoredSession {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getValidAccessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toStoredSession(tokens: TokenResponse): StoredSession {
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    idToken: tokens.id_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // expo-secure-store has no web backing (Platform note in Expo docs); treat as no stored session there.
        const raw = Platform.OS === 'web' ? null : await SecureStore.getItemAsync(STORAGE_KEY);
        if (raw) setSession(JSON.parse(raw) as StoredSession);
      } catch {
        // Corrupt or unreadable stored session — fall back to signed-out.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: StoredSession | null) => {
    setSession(next);
    if (Platform.OS === 'web') return; // no secure storage backing on web; session stays in memory only
    if (next) {
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(next));
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async () => {
    setAuthError(null);
    try {
      const request = await buildAuthorizationRequest();
      const result = await WebBrowser.openAuthSessionAsync(request.url, AUTH_REDIRECT_URI);

      if (result.type !== 'success') {
        return; // user cancelled — not an error
      }

      const { code, state } = parseCodeFromRedirectUrl(result.url);
      if (!code || state !== request.state) {
        throw new Error('Login could not be verified. Please try again.');
      }

      const tokens = await exchangeCodeForTokens(code, request.codeVerifier);
      await persist(toStoredSession(tokens));
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign-in failed.');
    }
  }, [persist]);

  const logout = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const getValidAccessToken = useCallback(async (): Promise<string> => {
    if (!session) throw new Error('Not signed in.');
    if (Date.now() < session.expiresAt - EXPIRY_SAFETY_MARGIN_MS) {
      return session.accessToken;
    }
    const refreshed = toStoredSession(await refreshTokens(session.refreshToken));
    await persist(refreshed);
    return refreshed.accessToken;
  }, [session, persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: session !== null,
      isLoading,
      authError,
      login,
      logout,
      getValidAccessToken,
    }),
    [session, isLoading, authError, login, logout, getValidAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
