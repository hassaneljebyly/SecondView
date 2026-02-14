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
