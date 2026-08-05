import { SHOPIFY_CONFIG } from '../config/shopify';

const STOREFRONT_ENDPOINT = `https://${SHOPIFY_CONFIG.myshopifyDomain}/api/${SHOPIFY_CONFIG.storefrontApiVersion}/graphql.json`;

interface GraphqlResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

async function storefrontQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(STOREFRONT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Storefront API request failed (${res.status})`);
  }

  const json = (await res.json()) as GraphqlResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  if (!json.data) {
    throw new Error('Storefront API returned no data.');
  }
  return json.data;
}

const RESOLVE_PRODUCTS_QUERY = `
  query ResolveRecommendedProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        productType
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  }
`;

export interface StorefrontProduct {
  id: string;
  title: string;
  handle: string;
  productType: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

interface ResolveProductsData {
  nodes: (StorefrontProduct | null)[];
}

/** Resolves product GIDs (e.g. from the recommended_products customer metafield) into display data. */
export async function resolveRecommendedProducts(productGids: string[]): Promise<StorefrontProduct[]> {
  if (productGids.length === 0) return [];
  const data = await storefrontQuery<ResolveProductsData>(RESOLVE_PRODUCTS_QUERY, { ids: productGids });
  return data.nodes.filter((node): node is StorefrontProduct => node !== null);
}
