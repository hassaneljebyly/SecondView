import type { FormInputData, Note } from '@shared/types/schemas';

/**
 * Validates whether a given form data object strictly matches the schema of allowed base form data.
 *
 * Validation checks:
 * - The input must be a non-null object.
 * - The number of fields must match exactly (no missing or extra fields).
 * - Each field must exist in the allowed schema.
 * - The type of each field value must match the corresponding type in the schema.
 *
 * @param formData - The form data to validate (unknown shape).
 * @param allowedBaseFormDataObj - An object representing the allowed schema with expected field types.
 * @returns True if `formData` strictly matches the schema, otherwise false.
 */
export function validFormFieldsSchema(
  formData: unknown,
  allowedBaseFormDataObj: FormInputData
): boolean {
  // Ensure input is a non-null object
  if (formData === null || typeof formData !== 'object') return false;

  return (
    // Ensure the same number of fields (no missing or extra fields)
    Object.keys(formData).length === Object.keys(allowedBaseFormDataObj).length &&
    // Validate each field
    Object.entries(formData).every(([key, value]) => {
      return (
        // Field must exist in schema
        key in allowedBaseFormDataObj &&
        // Type of value must match the schema's type
        typeof value === typeof allowedBaseFormDataObj[key as keyof typeof allowedBaseFormDataObj]
      );
    })
  );
}

/**
 * Checks whether a given timestamp string matches the provided pattern.
 *
 * @param timeStamp - The timestamp string to validate.
 * @param pattern - The regular expression pattern to test against.
 * @returns True if the string matches the pattern, otherwise false.
 */
export function timeStringIsValid(timeStamp: string, pattern: RegExp): boolean {
  return !!timeStamp.match(pattern);
}

/**
 * Converts a timestamp string into seconds, using a regex pattern with named groups.
 *
 * Expected named groups in the pattern:
 * - `h`: hours (optional)
 * - `m1` or `m2`: minutes (optional, one of them must exist if minutes are present)
 * - `s1`, `s2`, or `s3`: seconds (optional, defaults to 0 if none provided)
 *
 * @param timeStamp - The timestamp string to parse.
 * @param pattern - The regex pattern with named groups for hours, minutes, and seconds.
 * @returns The total time in seconds, or null if parsing fails.
 */
export function timeStringToSeconds(timeStamp: string, pattern: RegExp) {
  const m = pattern.exec(String(timeStamp).trim());
  if (!m) return null;

  const g = m.groups;
  if (!g) return null;

  const hours = g['h'] ? parseInt(g['h'], 10) : 0;
  const minutes = g['m1'] ? parseInt(g['m1'], 10) : g['m2'] ? parseInt(g['m2'], 10) : 0;

  const seconds = g['s1']
    ? parseInt(g['s1'], 10)
    : g['s2']
      ? parseInt(g['s2'], 10)
      : parseInt(g['s3'] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Determines if two time segments overlap.
 *
 * @param segmentStart - Start time (in seconds) of the new segment.
 * @param segmentEnd - End time (in seconds) of the new segment.
 * @param existingStart - Start time (in seconds) of the existing segment.
 * @param existingEnd - End time (in seconds) of the existing segment.
 * @returns True if the two segments overlap, otherwise false.
 */
export function isOverlapping(
  segmentStart: number,
  segmentEnd: number,
  existingStart: number,
  existingEnd: number
): boolean {
  // Overlap occurs if one segment starts before the other ends and ends after the other starts
  return segmentStart < existingEnd && segmentEnd > existingStart;
}

/**
 * Finds the first overlapping note from a list of existing notes.
 *
 * @param segmentStart - Start time (in seconds) of the new segment.
 * @param segmentEnd - End time (in seconds) of the new segment.
 * @param existingNotes - Array of existing notes with start and end times.
 * @returns The first overlapping note, or undefined if none overlap.
 */
export function findOverlappedSegment(
  segmentStart: number,
  segmentEnd: number,
  existingNotes: Note[]
) {
  return existingNotes.find(({ startTimeSeconds, endTimeSeconds }) =>
    isOverlapping(segmentStart, segmentEnd, startTimeSeconds, endTimeSeconds)
  );
}
