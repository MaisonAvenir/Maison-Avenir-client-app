import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  fetchCustomerProfile,
  updateCustomerBrands,
  updateCustomerMaterials,
  updateCustomerRecommendedProducts,
  updateCustomerWishlist,
} from '../api/shopifyCustomerApi';
import { resolveRecommendedProducts } from '../api/shopifyStorefrontApi';
import { notifyStaff } from '../api/staffNotify';
import { useAuth } from '../auth/AuthContext';
import { isShopifyConfigured } from '../config/shopify';
import { mapOrdersToPurchases, mapProductsToFeedItems } from '../data/shopifyMapping';
import { ADVISOR, CLIENT, INITIAL_FEED, PURCHASES } from '../data/mockData';
import type { Advisor, Client, FeedItem, Purchase } from '../types';

interface AppStateValue {
  client: Client;
  advisor: Advisor;
  purchases: Purchase[];
  feedItems: FeedItem[];
  feedIndex: number;
  currentFeedItem: FeedItem | null;
  savedItems: FeedItem[];
  reactToCurrentItem: (reaction: 'saved' | 'passed') => void;
  isLoadingCustomerData: boolean;
  customerDataError: string | null;
  updateMaterials: (materials: string[]) => Promise<void>;
  updateBrands: (brands: string[]) => Promise<void>;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getValidAccessToken } = useAuth();
  const [client, setClient] = useState<Client>(CLIENT);
  const [purchases, setPurchases] = useState<Purchase[]>(PURCHASES);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED);
  const [feedIndex, setFeedIndex] = useState(0);
  const [wishlistGids, setWishlistGids] = useState<string[]>([]);
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
          brands: profile.customer.brands?.jsonValue ?? [],
        }));

        const wishlist = profile.customer.wishlist?.jsonValue ?? [];
        setWishlistGids(wishlist);

        const recommendedGids = profile.customer.recommended?.jsonValue ?? [];
        const products = await resolveRecommendedProducts(recommendedGids);
        if (cancelled) return;
        const items = mapProductsToFeedItems(products).map((item) =>
          wishlist.includes(item.id) ? { ...item, reaction: 'saved' as const } : item,
        );
        setFeedItems(items);
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
      const updatedFeedItems = feedItems.map((f) => (f.id === item.id ? { ...f, reaction } : f));
      setFeedItems(updatedFeedItems);
      setFeedIndex((i) => i + 1);

      if (reaction === 'passed') {
        // Drop it (and any earlier passes) from the staff-curated list in Shopify too, so it's clear it was seen and declined.
        const remainingGids = updatedFeedItems.filter((f) => f.reaction !== 'passed').map((f) => f.id);
        getValidAccessToken()
          .then((accessToken) => updateCustomerRecommendedProducts(accessToken, client.id, remainingGids))
          .catch(() => {
            // Best-effort sync — the item still disappears from this device's feed either way.
          });
        notifyStaff(client.name, 'Declined recommendation', item.name);
      }

      if (reaction === 'saved' && !wishlistGids.includes(item.id)) {
        const newWishlist = [...wishlistGids, item.id];
        setWishlistGids(newWishlist);
        getValidAccessToken()
          .then((accessToken) => updateCustomerWishlist(accessToken, client.id, newWishlist))
          .catch(() => {
            // Best-effort sync — the item still shows as saved on this device either way.
          });
        notifyStaff(client.name, 'Saved to wishlist', item.name);
      }
    },
    [feedItems, feedIndex, client.id, client.name, wishlistGids, getValidAccessToken],
  );

  const updateMaterials = useCallback(
    async (materials: string[]) => {
      const accessToken = await getValidAccessToken();
      await updateCustomerMaterials(accessToken, client.id, materials);
      setClient((prev) => ({ ...prev, materials }));
      notifyStaff(client.name, 'Materials You Love', materials.join(', ') || '(none)');
    },
    [client.id, client.name, getValidAccessToken],
  );

  const updateBrands = useCallback(
    async (brands: string[]) => {
      const accessToken = await getValidAccessToken();
      await updateCustomerBrands(accessToken, client.id, brands);
      setClient((prev) => ({ ...prev, brands }));
      notifyStaff(client.name, 'Brands You Love', brands.join(', ') || '(none)');
    },
    [client.id, client.name, getValidAccessToken],
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
    reactToCurrentItem,
    isLoadingCustomerData,
    customerDataError,
    updateMaterials,
    updateBrands,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}
