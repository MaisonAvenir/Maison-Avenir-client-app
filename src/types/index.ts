export type PaletteKey =
  | 'brass'
  | 'linen'
  | 'oak'
  | 'plaster'
  | 'stone'
  | 'ceramic'
  | 'velvet';

export interface Client {
  id: string;
  name: string;
  memberSince: number;
  /** Style/material preference tags, editable in Profile. */
  materials: string[];
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  /** Placeholder for a real headshot until photography is available. */
  palette: PaletteKey;
}

export interface Purchase {
  id: string;
  name: string;
  date: string;
  price: number;
  palette: PaletteKey;
}

export type FeedReaction = 'saved' | 'passed' | null;

export interface FeedItem {
  id: string;
  name: string;
  price: number;
  palette: PaletteKey;
  material: string;
  /** Note from the advisor explaining why this item was picked. */
  note: string;
  reaction: FeedReaction;
}

export type MessageSender = 'advisor' | 'client';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
  read: boolean;
}

export type RootTabParamList = {
  Home: undefined;
  ForYou: undefined;
  Messages: undefined;
  History: undefined;
  Profile: undefined;
};
