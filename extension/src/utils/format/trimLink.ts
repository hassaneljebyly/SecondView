import { VALID_RELATIVE_URLS } from '@shared/utils/config/regexConfig';

import { logger } from '../lib/logger';

/**
 * Normalizes a given link so it can be safely used in an `href`,
 * and returns a truncated text label for display.
 *
 * - Ensures the input always starts with `https://www.`.
 * - The `href` property contains the normalized full URL.
 * - The `label` property contains a shortened version:
 *   <host>.../<lastPathSegment>
 *
 * Examples:
 * ```ts
 * truncateLinks("example.com/page/test");
 * // { href: "https://www.example.com/page/test", label: "example.../test" }
 *
 * truncateLinks("http://foo.com");
 * // { href: "https://www.foo.com", label: "foo" }
 * ```
 *
 * @param {string} link - The input link string.
 * @returns {{ href: string, label: string }} An object with the normalized URL and its truncated label.
 */
export function truncateLinks(link: string): { href: string; label: string } {
  try {
    // will be `true` if the link string doesn't start with https://, http://, https://www. or www.
    // which are accepted as sources but can't be used in the URL constructor
    const urlNormalizedToRelative = link.trim().replace(VALID_RELATIVE_URLS, 'https://www.');
    // The URL constructor only works for relative URLs
    const url = new URL(urlNormalizedToRelative);
    const host = url.host.replace('www.', '').split('.')[0];
    const pathNamesArray = url.pathname.split('/').filter(Boolean);
    // no paths will return empty array, so `pathNamesArray.at(-1)` will be `undefined`
    const lastPathString = pathNamesArray.at(-1) ?? '';
    const trimmedLink = host + '.../' + lastPathString;
    return { href: urlNormalizedToRelative.replace(/[.,!?;:]$/gm, ''), label: trimmedLink };
  } catch (error) {
    logger.error('Error trying to trim links', error);
    return { href: link, label: link };
  }
}
