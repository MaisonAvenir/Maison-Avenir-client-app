import type { Advisor, Client, FeedItem, Purchase } from '../types';

// Mock data standing in for a real backend. Shapes mirror the state model
// described in design/handoff/README.md ("State Management") so swapping
// this file for real API calls should not require touching the screens.

export const CLIENT: Client = {
  id: 'client-1',
  name: 'Eleanor Whitfield',
  memberSince: 2019,
  materials: ['Brass', 'Linen', 'Oak', 'Ceramic'],
  brands: [],
};

export const ADVISOR: Advisor = {
  id: 'advisor-1',
  name: 'Jennifer Houde',
  title: 'Buyer/Owner',
  palette: 'brass',
  photo: require('../../assets/advisor-jennifer.jpg'),
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
    brand: 'Maison Avenir',
    material: 'Brass',
    note: 'Margaux thought of you, after the candlesticks you chose in June.',
    reaction: null,
  },
  {
    id: 'f102',
    name: 'Plaster Table Lamp',
    price: 340,
    palette: 'plaster',
    brand: 'Maison Avenir',
    material: 'Plaster',
    note: 'A quieter companion to the armchair in your sitting room.',
    reaction: null,
  },
  {
    id: 'f103',
    name: 'Hand-loomed Wool Rug, in Clay',
    price: 1950,
    palette: 'stone',
    brand: 'Maison Avenir',
    material: 'Wool',
    note: 'Just arrived from our weaver in Umbria.',
    reaction: null,
  },
  {
    id: 'f104',
    name: 'Ceramic Pitcher Set',
    price: 210,
    palette: 'ceramic',
    brand: 'Maison Avenir',
    material: 'Ceramic',
    note: 'Pairs with the vase from last summer.',
    reaction: null,
  },
];

export function formatPrice(price: number): string {
  return '$' + price.toLocaleString('en-US');
}
