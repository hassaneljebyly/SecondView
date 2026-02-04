/**
 * Imports a raw secret key for use with HMAC-SHA256 signing.
 *
 * Converts the provided secret string into a `CryptoKey` compatible
 * with the Web Crypto API HMAC signing operation.
 *
 * This key is:
 * - Non-extractable
 * - Restricted to signing operations only
 *
 * @param secretKey The raw secret key material used for HMAC signing.
 *
 * @returns A promise resolving to a `CryptoKey` configured for HMAC-SHA256 signing.
 *
 * @security The returned key cannot be exported and is safe for in-memory use only.
 */
export async function getHmacKey(secretKey: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign']
  );

  return cryptoKey;
}

/**
 * Generates an HMAC-SHA256 signature for a canonical message.
 *
 * This function:
 * - Encodes the message as UTF-8
 * - Imports the provided signing key for HMAC-SHA256
 * - Produces a cryptographic signature using the Web Crypto API
 * - Returns the signature as a lowercase hexadecimal string
 *
 * @param signingKey The secret key used to generate the HMAC signature.
 *
 * @param message The canonical message to be signed.
 *
 * @returns A promise resolving to a hexadecimal-encoded HMAC-SHA256 signature.
 *
 * @security Relies on the Web Crypto API (`crypto.subtle`) for secure cryptographic operations.
 */
export async function getHMACSignature(signingKey: string, message: string) {
  const encoder = new TextEncoder();
  const messageData = encoder.encode(message);
  const cryptoKey = await getHmacKey(signingKey);
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return signatureHex;
}
