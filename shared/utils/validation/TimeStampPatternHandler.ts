import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';
import { timeStringIsValid } from './helpers';

/**
 * Validates that time fields (startTime, endTime) match the expected pattern format.
 * Only validates if the fields don't already have errors from previous validators.
 */
export class TimeStampPatternHandler extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData, timeStampRegex } = context;
    // Validate start time format if no existing error
    const startTimeField = formData['startTime'].trim();
    if (!this.errors['startTime'] && !timeStringIsValid(startTimeField, timeStampRegex)) {
      this.errors['startTime'] = 'Invalid Input (e.g. 02:40)';
    }

    // Validate end time format if no existing error
    const endTimeField = formData['endTime'].trim();
    if (!this.errors['endTime'] && !timeStringIsValid(endTimeField, timeStampRegex)) {
      this.errors['endTime'] = 'Invalid Input (e.g. 02:40)';
    }
  }
}
