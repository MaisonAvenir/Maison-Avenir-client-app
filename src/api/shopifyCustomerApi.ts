import { SHOPIFY_CONFIG } from '../config/shopify';

interface ApiDiscovery {
  graphql_api: string;
}

let cachedApiEndpoint: string | null = null;

async function discoverGraphqlEndpoint(): Promise<string> {
  if (cachedApiEndpoint) return cachedApiEndpoint;
  const res = await fetch(`https://${SHOPIFY_CONFIG.shopDomain}/.well-known/customer-account-api`);
  if (!res.ok) {
    throw new Error(`Failed to discover Customer Account API endpoint (${res.status})`);
  }
  const config = (await res.json()) as ApiDiscovery;
  cachedApiEndpoint = config.graphql_api;
  return cachedApiEndpoint;
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function customerApiQuery<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const endpoint = await discoverGraphqlEndpoint();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Customer Account API request failed (${res.status})`);
  }

  const json = (await res.json()) as GraphqlResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  if (!json.data) {
    throw new Error('Customer Account API returned no data.');
  }
  return json.data;
}

const CUSTOMER_PROFILE_QUERY = `
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      creationDate
      emailAddress { emailAddress }
      orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            totalPrice { amount currencyCode }
            lineItems(first: 10) {
              edges {
                node {
                  name
                  quantity
                  image { url altText }
                  currentTotalPrice { amount currencyCode }
                }
              }
            }
          }
        }
      }
      recommended: metafield(namespace: "avenir_prive", key: "recommended_products") {
        jsonValue
      }
      materials: metafield(namespace: "avenir_prive", key: "materials_loved") {
        jsonValue
      }
      brands: metafield(namespace: "avenir_prive", key: "brands_loved") {
        jsonValue
      }
    }
  }
`;

export interface CustomerOrderLineItem {
  name: string;
  quantity: number;
  image: { url: string; altText: string | null } | null;
  currentTotalPrice: { amount: string; currencyCode: string };
}

export interface CustomerOrder {
  id: string;
  name: string;
  processedAt: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: { edges: { node: CustomerOrderLineItem }[] };
}

export interface CustomerProfileData {
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    creationDate: string;
    emailAddress: { emailAddress: string } | null;
    orders: { edges: { node: CustomerOrder }[] };
    recommended: { jsonValue: string[] | null } | null;
    materials: { jsonValue: string[] | null } | null;
    brands: { jsonValue: string[] | null } | null;
  };
}

export async function fetchCustomerProfile(accessToken: string): Promise<CustomerProfileData> {
  return customerApiQuery<CustomerProfileData>(accessToken, CUSTOMER_PROFILE_QUERY);
}

const SET_TAG_LIST_MUTATION = `
  mutation SetTagListMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key value }
      userErrors { field message }
    }
  }
`;

interface SetTagListData {
  metafieldsSet: {
    metafields: { key: string; value: string }[];
    userErrors: { field: string[]; message: string }[];
  };
}

/** Saves a customer-editable list.single_line_text_field metafield, e.g. materials_loved or brands_loved. */
async function updateCustomerTagList(
  accessToken: string,
  customerId: string,
  key: string,
  values: string[],
): Promise<void> {
  const data = await customerApiQuery<SetTagListData>(accessToken, SET_TAG_LIST_MUTATION, {
    metafields: [
      {
        ownerId: customerId,
        namespace: 'avenir_prive',
        key,
        type: 'list.single_line_text_field',
        value: JSON.stringify(values),
      },
    ],
  });
  if (data.metafieldsSet.userErrors.length) {
    throw new Error(data.metafieldsSet.userErrors.map((e) => e.message).join('; '));
  }
}

/** Saves the customer's own "Materials You Love" tags back to their Shopify profile. */
export function updateCustomerMaterials(accessToken: string, customerId: string, materials: string[]): Promise<void> {
  return updateCustomerTagList(accessToken, customerId, 'materials_loved', materials);
}

/** Saves the customer's own "Brands You Love" tags back to their Shopify profile. */
export function updateCustomerBrands(accessToken: string, customerId: string, brands: string[]): Promise<void> {
  return updateCustomerTagList(accessToken, customerId, 'brands_loved', brands);
}

/** Removes a dismissed product from the staff-curated recommended_products list, so it's clear it was passed on. */
export async function updateCustomerRecommendedProducts(
  accessToken: string,
  customerId: string,
  productGids: string[],
): Promise<void> {
  const data = await customerApiQuery<SetTagListData>(accessToken, SET_TAG_LIST_MUTATION, {
    metafields: [
      {
        ownerId: customerId,
        namespace: 'avenir_prive',
        key: 'recommended_products',
        type: 'list.product_reference',
        value: JSON.stringify(productGids),
      },
    ],
  });
  if (data.metafieldsSet.userErrors.length) {
    throw new Error(data.metafieldsSet.userErrors.map((e) => e.message).join('; '));
  }
}
