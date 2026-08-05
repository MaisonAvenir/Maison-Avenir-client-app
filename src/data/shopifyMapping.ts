import type { CustomerOrder } from '../api/shopifyCustomerApi';
import type { StorefrontProduct } from '../api/shopifyStorefrontApi';
import type { FeedItem, PaletteKey, Purchase } from '../types';
import { PALETTES } from './palettes';

const PALETTE_KEYS = Object.keys(PALETTES) as PaletteKey[];

/** Deterministic placeholder palette for a Shopify id, used when there's no photography yet. */
export function paletteForId(id: string): PaletteKey {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETTE_KEYS[hash % PALETTE_KEYS.length];
}

function formatOrderDate(processedAt: string): string {
  return new Date(processedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Each Shopify order becomes one purchase row, priced and named from its first line item. */
export function mapOrdersToPurchases(orders: CustomerOrder[]): Purchase[] {
  return orders.map((order) => {
    const firstLine = order.lineItems.edges[0]?.node ?? null;
    return {
      id: order.id,
      name: firstLine ? firstLine.name : order.name,
      date: formatOrderDate(order.processedAt),
      price: Number(order.totalPrice.amount),
      palette: paletteForId(order.id),
      imageUrl: firstLine?.image?.url,
    };
  });
}

export function mapProductsToFeedItems(products: StorefrontProduct[]): FeedItem[] {
  return products.map((product) => ({
    id: product.id,
    name: product.title,
    price: Number(product.priceRange.minVariantPrice.amount),
    palette: paletteForId(product.id),
    material: product.productType || 'New Arrival',
    note: 'Handpicked for you by your advisor.',
    reaction: null,
    imageUrl: product.featuredImage?.url,
  }));
}
