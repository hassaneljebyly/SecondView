import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';
import { timeStringToSeconds } from './helpers';

/**
 * Validates that the time segment meets the minimum length requirement.
 * Only validates if both time fields are valid and error-free.
 */
export class StartEndTimeOrderValidator extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData, timeStampRegex } = context;
    const { startTime, endTime } = formData;

    // Convert time strings to seconds for calculation
    const startTimeSeconds = timeStringToSeconds(startTime, timeStampRegex);
    const endTimeSeconds = timeStringToSeconds(endTime, timeStampRegex);

    // Only validate if both times are valid and have no previous errors
    if (
      !this.errors['startTime'] &&
      !this.errors['endTime'] &&
      startTimeSeconds !== null &&
      endTimeSeconds !== null
    ) {
      const startEndTimeOrderInvalid = endTimeSeconds < startTimeSeconds;
      if (startEndTimeOrderInvalid) {
        this.errors['endTime'] = 'End time must be after start time.';
      }
    }
  }
}
