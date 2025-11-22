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
 * Generates a random code of specified length.
 * It trims or pads a random string to ensure the code has exactly `len` characters.
 *
 * @param {number} [len=8] - The desired length of the random code.
 * @returns {string} A random code string of length `len`.
 */
export function generateRandomCode(len: number = 8): string {
  const trimmedRandomString = getRandomString().substring(0, len);
  const randomCode = trimmedRandomString.padEnd(len, getRandomString());
  return randomCode;
}

/**
 * Returns a random separator character from a predefined list.
 * The possible separators are an empty string (''), a hyphen ('-'), or an underscore ('_').
 *
 * @returns {string} A randomly selected separator character.
 */
export function getRandomSeparators(): string {
  const separators = ['', '-', '_'];
  return separators[Math.floor(Math.random() * separators.length)] ?? '';
}

/**
 * Generates a random username composed of:
 * - A random adjective
 * - A random separator (empty string, hyphen, or underscore)
 * - A random noun
 * - Another separator
 * - A random code (from {@link generateRandomCode})
 *
 * Example output: `"Lucky-Cookie-fd278299"`
 *
 * @returns {string} A randomly generated username.
 *
 * @throws {ReferenceError} If `NOUNS`, `ADJECTIVES`, or `generateRandomCode` are not defined in scope.
 */
export function generateRandomUserName(): string {
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randCode = generateRandomCode();
  const randSep = getRandomSeparators();
  return `${adj}${randSep}${noun}${randSep}${randCode}`;
}

export function createNewUserAndAccessKey(): Profile {
  const userName = generateRandomUserName();
  const accessKey = crypto.randomUUID();
  return {
    userName,
    accessKey,
  };
}
