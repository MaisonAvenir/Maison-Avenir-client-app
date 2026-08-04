import type { Advisor, Client, FeedItem, Message, Purchase } from '../types';

// Mock data standing in for a real backend. Shapes mirror the state model
// described in design/handoff/README.md ("State Management") so swapping
// this file for real API calls should not require touching the screens.

export const CLIENT: Client = {
  id: 'client-1',
  name: 'Eleanor Whitfield',
  memberSince: 2019,
  materials: ['Brass', 'Linen', 'Oak', 'Ceramic'],
};

export const ADVISOR: Advisor = {
  id: 'advisor-1',
  name: 'Margaux Sinclair',
  title: 'Client Advisor',
  palette: 'brass',
};

export const PURCHASES: Purchase[] = [
  { id: 'p1', name: 'The Brass Candlestick Pair', date: 'June 14, 2026', price: 420, palette: 'brass' },
  { id: 'p2', name: 'Linen Throw, in Stone', date: 'March 2, 2026', price: 248, palette: 'linen' },
  { id: 'p3', name: 'Oak Refectory Table', date: 'November 20, 2025', price: 3800, palette: 'oak' },
  { id: 'p4', name: 'Hand-thrown Ceramic Vase', date: 'August 9, 2025', price: 165, palette: 'ceramic' },
  { id: 'p5', name: 'Velvet Armchair, in Ink', date: 'April 30, 2025', price: 2200, palette: 'velvet' },
];

export const INITIAL_FEED: FeedItem[] = [
  {
    id: 'f101',
    name: 'Aged Brass Candelabra',
    price: 560,
    palette: 'brass',
    material: 'Brass',
    note: 'Margaux thought of you, after the candlesticks you chose in June.',
    reaction: null,
  },
  {
    id: 'f102',
    name: 'Plaster Table Lamp',
    price: 340,
    palette: 'plaster',
    material: 'Plaster',
    note: 'A quieter companion to the armchair in your sitting room.',
    reaction: null,
  },
  {
    id: 'f103',
    name: 'Hand-loomed Wool Rug, in Clay',
    price: 1950,
    palette: 'stone',
    material: 'Wool',
    note: 'Just arrived from our weaver in Umbria.',
    reaction: null,
  },
  {
    id: 'f104',
    name: 'Ceramic Pitcher Set',
    price: 210,
    palette: 'ceramic',
    material: 'Ceramic',
    note: 'Pairs with the vase from last summer.',
    reaction: null,
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'advisor',
    text: 'The Brass Candelabra just arrived — thought of your candlesticks straight away.',
    time: '9:14 AM',
    read: true,
  },
  {
    id: 'm2',
    sender: 'client',
    text: 'It’s lovely. Does it come in a smaller scale?',
    time: '9:20 AM',
    read: true,
  },
  {
    id: 'm3',
    sender: 'advisor',
    text: 'Yes — I’ll set one aside so you can see it in person before it’s listed.',
    time: '9:22 AM',
    read: true,
  },
];

export function formatPrice(price: number): string {
  return '$' + price.toLocaleString('en-US');
}
