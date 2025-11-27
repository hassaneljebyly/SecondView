import type { Profile } from '@/types/storage';

import { ADJECTIVES, NOUNS } from '../config/userNameLists';

/**
 * Generates a random string based on a random number.
 * Converts the number to a base-18 string and removes the "0." prefix.
 *
 * @returns {string} A random alphanumeric string.
 */
export function getRandomString(): string {
  const randomNum = Math.random();
  const randomString = randomNum.toString(18).substring(2);
  return randomString;
}

/**
 * Generates a cryptographically secure 6-character hexadecimal string.
 *
 * This function creates a 3-byte `Uint8Array`, fills it with random values
 * using `crypto.getRandomValues`, and converts the bytes into a lowercase
 * hex string. The result is always 6 hex characters (e.g., `"a3f91c"`).
 *
 * @returns {string} A randomly generated 6-character hexadecimal string.
 */
export function randomHex6(): string {
  const UinArray = new Uint8Array(3);
  const randomBitArray = Array.from(crypto.getRandomValues(UinArray));
  const hexCodeString = randomBitArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexCodeString;
}
/**
 * Generates a random username composed of an adjective, a noun, and a 6-character hex code.
 *
 * The final format looks like: `AdjectiveNoun_ABC123`
 *
 * @function
 * @returns {string} A randomly generated username string.
 *
 * @example
 * const username = generateRandomUserName();
 * // "SwiftTiger_A3F9B2"
 */
export function generateRandomUserName(): string {
  const noun = getRandomItemFromArray(NOUNS);
  const adj = getRandomItemFromArray(ADJECTIVES);
  const randCode = randomHex6();
  return `${adj}${noun}_${randCode}`;
}

export function createNewUserAndAccessKey(): Profile {
  const userName = generateRandomUserName();
  const accessKey = crypto.randomUUID();
  return {
    userName,
    accessKey,
  };
}

/**
 * Returns a random item from a given array using cryptographically secure randomness.
 *
 * This function uses the Web Crypto API to generate a random number,
 * ensuring better randomness than `Math.random()`.
 *
 * @template T
 * @param {Array<T>} array - The array to pick a random item from. Must not be empty.
 * @returns {T} A randomly selected item from the input array.
 */
export function getRandomItemFromArray<T>(array: Array<T>): T {
  const UinArray = new Uint32Array(1);
  const randomCryptoNumber = Number(crypto.getRandomValues(UinArray));
  const randomIndex = Math.floor((randomCryptoNumber / 2 ** 32) * (array.length - 1));

  return array[randomIndex] as T;
}
