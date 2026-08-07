import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { fetchCustomerProfile, updateCustomerMaterials } from '../api/shopifyCustomerApi';
import { resolveRecommendedProducts } from '../api/shopifyStorefrontApi';
import { useAuth } from '../auth/AuthContext';
import { isShopifyConfigured } from '../config/shopify';
import { mapOrdersToPurchases, mapProductsToFeedItems } from '../data/shopifyMapping';
import { ADVISOR, CLIENT, INITIAL_FEED, INITIAL_MESSAGES, PURCHASES } from '../data/mockData';
import type { Advisor, Client, FeedItem, Message, Purchase } from '../types';

interface AppStateValue {
  client: Client;
  advisor: Advisor;
  purchases: Purchase[];
  feedItems: FeedItem[];
  feedIndex: number;
  currentFeedItem: FeedItem | null;
  savedItems: FeedItem[];
  messages: Message[];
  draft: string;
  setDraft: (text: string) => void;
  sendMessage: () => void;
  reactToCurrentItem: (reaction: 'saved' | 'passed') => void;
  isLoadingCustomerData: boolean;
  customerDataError: string | null;
  updateMaterials: (materials: string[]) => Promise<void>;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getValidAccessToken } = useAuth();
  const [client, setClient] = useState<Client>(CLIENT);
  const [purchases, setPurchases] = useState<Purchase[]>(PURCHASES);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED);
  const [feedIndex, setFeedIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);
  const [customerDataError, setCustomerDataError] = useState<string | null>(null);

  useEffect(() => {
    if (!isShopifyConfigured() || !isAuthenticated) return;

    let cancelled = false;
    (async () => {
      setIsLoadingCustomerData(true);
      setCustomerDataError(null);
      try {
        const accessToken = await getValidAccessToken();
        const profile = await fetchCustomerProfile(accessToken);
        if (cancelled) return;

        const orders = profile.customer.orders.edges.map((e) => e.node);
        setPurchases(mapOrdersToPurchases(orders));

        const fullName = [profile.customer.firstName, profile.customer.lastName].filter(Boolean).join(' ');
        setClient((prev) => ({
          ...prev,
          id: profile.customer.id,
          name: fullName || prev.name,
          memberSince: new Date(profile.customer.creationDate).getFullYear(),
          materials: profile.customer.materials?.jsonValue ?? [],
        }));

        const recommendedGids = profile.customer.recommended?.jsonValue ?? [];
        const products = await resolveRecommendedProducts(recommendedGids);
        if (cancelled) return;
        setFeedItems(mapProductsToFeedItems(products));
        setFeedIndex(0);
      } catch (err) {
        if (!cancelled) {
          setCustomerDataError(err instanceof Error ? err.message : 'Could not load your account data.');
        }
      } finally {
        if (!cancelled) setIsLoadingCustomerData(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getValidAccessToken]);

  const reactToCurrentItem = useCallback(
    (reaction: 'saved' | 'passed') => {
      const item = feedItems[feedIndex];
      if (!item) return;
      setFeedItems((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, reaction } : f)),
      );
      setFeedIndex((i) => i + 1);
    },
    [feedItems, feedIndex],
  );

  const sendMessage = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        sender: 'client',
        text,
        time: 'Just now',
        read: true,
      },
    ]);
    setDraft('');
  }, [draft]);

  const updateMaterials = useCallback(
    async (materials: string[]) => {
      const accessToken = await getValidAccessToken();
      await updateCustomerMaterials(accessToken, client.id, materials);
      setClient((prev) => ({ ...prev, materials }));
    },
    [client.id, getValidAccessToken],
  );

  const currentFeedItem = feedItems[feedIndex] ?? null;
  const savedItems = useMemo(
    () => feedItems.filter((f) => f.reaction === 'saved'),
    [feedItems],
  );

  const value: AppStateValue = {
    client,
    advisor: ADVISOR,
    purchases,
    feedItems,
    feedIndex,
    currentFeedItem,
    savedItems,
    messages,
    draft,
    setDraft,
    sendMessage,
    reactToCurrentItem,
    isLoadingCustomerData,
    customerDataError,
    updateMaterials,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}
