import * as Crypto from 'expo-crypto';

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64UrlFromBase64(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Base64-encodes raw bytes without relying on btoa/Buffer, which aren't guaranteed in the RN JS runtime. */
function bytesToBase64Url(bytes: Uint8Array): string {
  let base64 = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];

    base64 += BASE64_CHARS[b0 >> 2];
    base64 += BASE64_CHARS[((b0 & 0x03) << 4) | (b1 === undefined ? 0 : b1 >> 4)];
    base64 += b1 === undefined ? '' : BASE64_CHARS[((b1 & 0x0f) << 2) | (b2 === undefined ? 0 : b2 >> 6)];
    base64 += b2 === undefined ? '' : BASE64_CHARS[b2 & 0x3f];
  }
  return base64UrlFromBase64(base64);
}

/** A high-entropy, unreserved-charset random string per RFC 7636. */
export async function generateCodeVerifier(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(64);
  return bytesToBase64Url(randomBytes);
}

/** SHA-256(verifier), base64url-encoded, per RFC 7636 S256 method. */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const digestBase64 = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
    encoding: Crypto.CryptoEncoding.BASE64,
  });
  return base64UrlFromBase64(digestBase64);
}

export async function generateRandomState(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return bytesToBase64Url(bytes);
}
