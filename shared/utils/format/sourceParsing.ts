/**
 * extracts source strings from a note's content using a given regex pattern.
 *
 * The function searches the note for all matches of the provided regex.
 * - always returns an array (empty if no matches).
 * - trims trailing punctuation (e.g., `.`, `,`, `;`, `:`) from each match.
 *
 * @param {string} noteContent - The text content of the note to search
 * @param {RegExp} pattern - A global regex pattern (`/g` flag required) used to extract sources.
 * @returns {string[]} An array of extracted source strings with trailing punctuation removed.
 */
export function extractSourcesFromNote(noteContent: string, pattern: RegExp): string[] {
  const matches = noteContent.match(pattern);
  if (!matches) return [];

  return matches.map(
    source => source.replace(/[.,;:]+$/, '') // strip trailing punctuation
  );
}
