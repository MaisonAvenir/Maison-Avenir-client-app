import { AUTH_REDIRECT_URI, AUTH_SCOPE, SHOPIFY_CONFIG } from '../config/shopify';
import { generateCodeChallenge, generateCodeVerifier, generateRandomState } from './pkce';

export interface DiscoveryDocument {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
}

let cachedDiscovery: DiscoveryDocument | null = null;

export async function discoverEndpoints(): Promise<DiscoveryDocument> {
  if (cachedDiscovery) return cachedDiscovery;
  const res = await fetch(`https://${SHOPIFY_CONFIG.shopDomain}/.well-known/openid-configuration`);
  if (!res.ok) {
    throw new Error(`Failed to discover Shopify auth endpoints (${res.status})`);
  }
  cachedDiscovery = (await res.json()) as DiscoveryDocument;
  return cachedDiscovery;
}

export interface PendingAuthRequest {
  url: string;
  codeVerifier: string;
  state: string;
}

export async function buildAuthorizationRequest(): Promise<PendingAuthRequest> {
  const discovery = await discoverEndpoints();
  const codeVerifier = await generateCodeVerifier();
  const state = await generateRandomState();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const url = new URL(discovery.authorization_endpoint);
  url.searchParams.set('scope', AUTH_SCOPE);
  url.searchParams.set('client_id', SHOPIFY_CONFIG.customerAccountApiClientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', AUTH_REDIRECT_URI);
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  return { url: url.toString(), codeVerifier, state };
}

export async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenResponse> {
  const discovery = await discoverEndpoints();
  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('client_id', SHOPIFY_CONFIG.customerAccountApiClientId);
  body.append('redirect_uri', AUTH_REDIRECT_URI);
  body.append('code', code);
  body.append('code_verifier', codeVerifier);

  const res = await fetch(discovery.token_endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as TokenResponse;
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  const discovery = await discoverEndpoints();
  const body = new URLSearchParams();
  body.append('grant_type', 'refresh_token');
  body.append('client_id', SHOPIFY_CONFIG.customerAccountApiClientId);
  body.append('refresh_token', refreshToken);

  const res = await fetch(discovery.token_endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    throw new Error(`Token refresh failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as TokenResponse;
}

export function parseCodeFromRedirectUrl(redirectUrl: string): { code: string | null; state: string | null } {
  const url = new URL(redirectUrl);
  return { code: url.searchParams.get('code'), state: url.searchParams.get('state') };
}
