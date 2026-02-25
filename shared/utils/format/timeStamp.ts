import { logger } from '@/utils/lib/logger';

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

/**
 * converts ISO string to local time string format
 *
 * @param {string} isoUTCString ISO string in UTC (e.g 2026-02-07T15:30:00Z)
 * @returns {string} local time string (e.g Feb 7, 2026, 4:30 PM) return isoUTCString if error happened
 */
export function isoStringToLocalTimeString(isoUTCString: string): string {
  try {
    const date = new Date(isoUTCString);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch (error) {
    logger.error(error);
    return isoUTCString;
  }
}

type TimeUnit = Intl.RelativeTimeFormatUnit;
// @ts-expect-error just ignore missing properties
const UNITS: Readonly<Record<TimeUnit, number>> = {
  year: 60 * 60 * 24 * 365,
  quarter: (60 * 60 * 24 * 365) / 4,
  month: 60 * 60 * 24 * 30,
  week: 60 * 60 * 24 * 7,
  day: 60 * 60 * 24,
  hour: 60 * 60,
  minute: 60,
  second: 1,
};

/**
 * Formats a date as a relative time string (e.g., "2 minutes ago", "in 3 days").
 *
 * @param input - The date to format. Can be a Date object, ISO string, or timestamp.
 * @param locale - BCP 47 locale string used for formatting (default: "en").
 * @returns A localized relative time string. Returns "Invalid date" if the input cannot be parsed.
 *
 * @example
 * timeAgo(new Date(Date.now() - 60000)) // "1 minute ago"
 * timeAgo(Date.now() + 3600000) // "in 1 hour"
 * timeAgo("2025-01-01T00:00:00Z", "fr") // "dans 3 jours" (depending on current date)
 */
export function timeAgo(input: Date | string | number, locale = 'en'): string {
  const date = input instanceof Date ? input : new Date(input);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = Date.now();
  const diffInSeconds = (date.getTime() - now) / 1000;

  const rtf =
    typeof Intl !== 'undefined' && Intl.RelativeTimeFormat
      ? new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
      : null;

  for (const unit of Object.keys(UNITS) as TimeUnit[]) {
    const secondsInUnit = UNITS[unit];
    const value = diffInSeconds / secondsInUnit;

    if (Math.abs(value) >= 1 || unit === 'second') {
      const rounded = Math.round(value);
      return rtf
        ? rtf.format(rounded, unit)
        : `${Math.abs(rounded)} ${unit}${Math.abs(rounded) !== 1 ? 's' : ''} ${
            rounded < 0 ? 'ago' : 'from now'
          }`;
    }
  }

  return 'just now';
}

/**
 * Calculates the remaining time until a future ISO date string
 * and returns a compact duration string (e.g., "2d 3h 10m 5s").
 *
 * Negative values are clamped to 0 to prevent UI flicker.
 *
 * @param futureIso - A future date in ISO string format.
 * @returns A formatted duration string (e.g., "1h 30m"), or an empty string if invalid.
 *
 * @example
 * getRemainingTimeFormatted("2026-12-31T23:59:59Z")
 * // "10d 4h 12m 3s"
 */
export function getRemainingTimeFormatted(futureIso: string): string {
  const future = new Date(futureIso).getTime();

  if (isNaN(future)) {
    return '';
  }

  const now = Date.now();
  const diff = Math.max(0, future - now);

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (totalSeconds === 0) {
    return '0s';
  }

  const parts: string[] = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Converts a number of seconds into a human-readable duration string
 * formatted as "Xh Ym Zs".
 *
 * Internally relies on `secondsToTimeString` returning a "HH:mm:ss" string.
 *
 * @param seconds - Total duration in seconds.
 * @returns A formatted duration string (e.g., "1h 5m 3s").
 *          Returns the original seconds value if formatting fails.
 *
 * @example
 * formatSecondsToDuration(3661) // "1h 1m 1s"
 * formatSecondsToDuration(60)   // "1m"
 */
export function formatSecondsToDuration(seconds: number) {
  try {
    const desiredLength = 3;
    const timeStringArray = secondsToTimeString(seconds).split(':');
    // pad left array to get desired hh, mm, ss structure
    const padLeftTimeStringArray = [
      ...Array(desiredLength - timeStringArray.length).fill(0),
      ...timeStringArray,
    ];
    const [h, m, s] = padLeftTimeStringArray.map(Number);
    const hoursLong = h ? `${h}h ` : '';
    const minutesLong = m ? `${m}m ` : '';
    const secondsLong = s ? `${s}s` : '';
    return `${hoursLong}${minutesLong}${secondsLong}`;
  } catch (error) {
    logger.error(error);
    return seconds;
  }
}
