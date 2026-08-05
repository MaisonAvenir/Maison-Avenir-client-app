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
  };
}

export async function fetchCustomerProfile(accessToken: string): Promise<CustomerProfileData> {
  return customerApiQuery<CustomerProfileData>(accessToken, CUSTOMER_PROFILE_QUERY);
}
