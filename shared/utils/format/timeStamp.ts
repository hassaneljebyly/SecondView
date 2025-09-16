/**
 * Converts a number of seconds into a formatted time string.
 *
 * Format rules:
 * - If `hours > 0`: returns `HH:MM:SS` (zero-padded hours, minutes, seconds).
 * - If `hours = 0`: returns `M:SS` (minutes not padded, seconds zero-padded).
 *
 * Examples:
 * - `secondsToTimeString(65)` → `"1:05"`
 * - `secondsToTimeString(3661)` → `"01:01:01"`
 *
 * @param seconds - The total number of seconds.
 * @returns A formatted time string.
 */
export function secondsToTimeString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const timeParts = [
    // Include hours only if > 0
    hours > 0 ? String(hours).padStart(2, '0') : null,

    // If hours exist, pad minutes to 2 digits; otherwise leave as-is
    hours > 0 ? String(minutes).padStart(2, '0') : String(minutes),

    // Always pad seconds to 2 digits
    String(secs).padStart(2, '0'),
  ].filter(Boolean); // remove nulls (when hours = 0)

  return timeParts.join(':');
}
