import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';
import { findOverlappedSegment, timeStringToSeconds } from './helpers';
import { secondsToTimeString } from '../format/timeStamp';

/**
 * Validates that the new segment doesn't overlap with existing segments.
 *
 * Visual representation of overlap scenarios:
 * e = endTimeInSeconds, s = startTimeInSeconds
 *
 *                     startTime            endTime
 * --------------------|====================|-----------------
 *   s      e       s      e   s      e   s      e   s      e
 * --|======|-------|======|---|======|---|======|---|======|--
 *   no-overlap     overlap    overlap    overlap    no-overlap
 */
export class SegmentsOverlapValidator extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData, timeStampRegex, existingNotes } = context;
    const { startTime, endTime } = formData;
    // Only check for overlaps if time fields are valid
    if (!this.errors['startTime'] && !this.errors['endTime']) {
      // Convert time strings to seconds for overlap calculation
      const startOfSegmentSeconds = timeStringToSeconds(startTime, timeStampRegex);
      const endOfSegmentSeconds = timeStringToSeconds(endTime, timeStampRegex);

      // Check for overlaps if we have existing notes and valid time values
      if (existingNotes.length && endOfSegmentSeconds !== null && startOfSegmentSeconds !== null) {
        const overlappedSegment = findOverlappedSegment(
          startOfSegmentSeconds,
          endOfSegmentSeconds,
          existingNotes
        );

        // If overlap found, provide detailed error message with conflicting segment info
        if (overlappedSegment) {
          const overlapStart = secondsToTimeString(overlappedSegment.startTimeSeconds);
          const overlapEnd = secondsToTimeString(overlappedSegment.endTimeSeconds);
          this.errors['form'] =
            `Someone already added a note for ${overlapStart}-${overlapEnd} and your note overlaps with it - choose a different time range or check the existing note.`;
        }
      }
    }
  }
}
