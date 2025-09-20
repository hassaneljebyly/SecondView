import type { AccurateRatingValue, InaccurateRatingValue } from '@shared/types/noteRating';

/**
 * Validate that all selected rating reasons are allowed for the current tab.
 * @param selectedReasons - Array of currently selected reasons
 * @param allowedValues - Array of all valid checkbox values for the tab
 * @returns true if all selected reasons are valid; false otherwise
 */
export function validateSelectedReasons(
  selectedReasons: (AccurateRatingValue | InaccurateRatingValue)[],
  allowedValues: (AccurateRatingValue | InaccurateRatingValue)[]
): boolean {
  const allowedSet = new Set(allowedValues);
  return selectedReasons.every(reason => allowedSet.has(reason));
}
