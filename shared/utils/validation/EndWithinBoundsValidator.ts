import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';
import { timeStringToSeconds } from './helpers';
import { secondsToTimeString } from '../format/timeStamp';

/**
 * Validates that the segment end time doesn't exceed the video's total length.
 * Prevents users from creating segments that extend beyond the video duration.
 */
export class EndWithinBoundsValidator extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData, videoLength, timeStampRegex } = context;
    const { endTime } = formData;

    // Convert end time to seconds for comparison
    const endTimeSeconds = timeStringToSeconds(endTime, timeStampRegex);

    // Only validate if times are valid and have no previous errors
    if (
      !this.errors['startTime'] &&
      !this.errors['endTime'] &&
      endTimeSeconds !== null &&
      endTimeSeconds > videoLength
    ) {
      this.errors['endTime'] =
        `Segment end cannot exceed video length (${secondsToTimeString(videoLength)})`;
    }
  }
}
