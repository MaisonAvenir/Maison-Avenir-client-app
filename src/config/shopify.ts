/**
 * Shopify connection settings.
 *
 * Fill these in from your Shopify admin under
 * Sales channels → Headless → (your storefront) → Customer Account API settings
 * and → Storefront API settings. See README.md for the full walkthrough.
 *
 * None of these values are secret — the Customer Account API "Mobile" client
 * has no client secret, and the Storefront token is meant to ship in clients.
 */
export const SHOPIFY_CONFIG = {
  /** Your store's primary domain, e.g. "maisonavenir.com". No https://, no trailing slash. */
  shopDomain: 'maisonavenir.com',

  /** Your store's *.myshopify.com domain, used for Storefront API requests. */
  myshopifyDomain: '0ec086-3d.myshopify.com',

  /** Customer Account API "Mobile" client ID, from the Headless channel's Customer Account API settings. */
  customerAccountApiClientId: 'REPLACE_WITH_CUSTOMER_ACCOUNT_API_CLIENT_ID',

  /**
   * The numeric shop id used in the mobile OAuth callback scheme, e.g. "69813895395".
   * Shown in the Customer Account API settings, and as the number in your
   * customer accounts URL (https://shopify.com/<shop_id>/account).
   */
  shopId: '69813895395',

  /** Public Storefront API access token, from the Headless channel's Storefront API settings. */
  storefrontAccessToken: 'REPLACE_WITH_STOREFRONT_ACCESS_TOKEN',

  /** Storefront API version to call. */
  storefrontApiVersion: '2026-01',
} as const;

/**
 * Shopify requires mobile OAuth callback URLs to use the scheme "shop.<shop_id>.*"
 * so the scheme is guaranteed unique across every Shopify-connected app on the device.
 */
export const AUTH_REDIRECT_URI = `shop.${SHOPIFY_CONFIG.shopId}.avenirprive://callback`;

export const AUTH_SCOPE = 'openid email customer-account-api:full';

export function isShopifyConfigured(): boolean {
  return (
    !SHOPIFY_CONFIG.customerAccountApiClientId.startsWith('REPLACE_') &&
    !SHOPIFY_CONFIG.storefrontAccessToken.startsWith('REPLACE_')
  );
}
