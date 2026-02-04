/**
 * Creates a canonical string representation of a request for HMAC signing.
 *
 * @remarks canonicalFields must be a flat object
 *
 * @export
 * @param {string} canonicalPath canonical path parsed from request url
 * @param {Record<string, unknown>} canonicalFields The security-relevant fields for the action.
 * @param {string} timestamp valid ISO 8601 UTC timestamp.
 * @param {string} method HTTP method (GET, POST, etc.).
 * @returns {string} The canonical string ready for HMAC signing.
 */
export function createCanonicalMessage(
  canonicalPath: string,
  canonicalFields: Record<string, unknown>,
  timestamp: string,
  method: string
): string {
  const sortedKeys = Object.keys(canonicalFields).sort();

  const canonicalString = sortedKeys
    .map(field => `${String(field)}=${serializeData(canonicalFields[field])}`)
    .join('&');

  const message = [canonicalPath, canonicalString, timestamp, method.toLowerCase()].join('|');

  return normalizeString(message);
}

/**
 * Serializes arbitrary data into a canonical string representation suitable
 * for HMAC signature generation.
 *
 * This function:
 * - Handles primitive types (`null`, `undefined`, `number`, `boolean`, `string`)
 * - Recursively serializes arrays and objects
 * - Sorts array elements and object keys to ensure deterministic output
 * - Uses `normalizeString` for string values
 *
 * Example output:
 * ```ts
 * serializeData({b: 2, a: [true, "hello"]})
 * // "{a=[true&hello]&b=2}"
 * ```
 *
 * @param value The value to serialize (primitives, arrays, or objects).
 *
 * @returns A canonical string representation of the input, suitable for signing.
 */
export function serializeData(value: unknown): string {
  // handle primitives
  if (value === null) return '__null__';
  if (typeof value === 'undefined') return '__undefined__';
  if (typeof value === 'number') return String(Math.floor(value));
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'string') return normalizeString(value);

  // arrays
  if (Array.isArray(value)) {
    const serializedItems = value.map(item => serializeData(item)).sort();
    return `[${serializedItems.join('&')}]`;
  }

  // objects (recursively serialize nested fields)
  if (typeof value === 'object' && value !== null) {
    const sortedKeys = Object.keys(value).sort();
    const serializedFields = sortedKeys
      .map(key => `${key}=${serializeData((value as Record<string, unknown>)[key])}`)
      .join('&');
    return `{${serializedFields}}`;
  }

  // should never hit this with proper types
  return '__unknown__';
}

/**
 * Normalizes a string to a canonical form for signing or comparison.
 *
 * This function:
 * - Applies Unicode NFC normalization
 * - Converts Windows-style line endings `\r\n` to `\n`
 * - Trims leading and trailing whitespace
 *
 * @param str The input string to normalize.
 *
 * @returns A normalized string safe for deterministic serialization or HMAC signing.
 */
export function normalizeString(str: string): string {
  return str.normalize('NFC').replace(/\r\n/g, '\n').trim();
}
