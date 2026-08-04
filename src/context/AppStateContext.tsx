import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

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
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED);
  const [feedIndex, setFeedIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

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

  const currentFeedItem = feedItems[feedIndex] ?? null;
  const savedItems = useMemo(
    () => feedItems.filter((f) => f.reaction === 'saved'),
    [feedItems],
  );

  const value: AppStateValue = {
    client: CLIENT,
    advisor: ADVISOR,
    purchases: PURCHASES,
    feedItems,
    feedIndex,
    currentFeedItem,
    savedItems,
    messages,
    draft,
    setDraft,
    sendMessage,
    reactToCurrentItem,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}
