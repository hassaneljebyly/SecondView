import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';

/**
 * Validates that the note content meets length requirements (both minimum and maximum).
 * Ensures notes are substantive enough to be useful but not excessively long.
 */
export class NoteLengthValidator extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData, maxNoteLength, minNoteLength } = context;
    const { noteContent } = formData;
    // Only validate if note content doesn't already have an error
    if (!this.errors['noteContent']) {
      // Check minimum length requirement
      if (noteContent.trim().length < minNoteLength) {
        this.errors['noteContent'] = `Note must be at least ${minNoteLength} characters long.`;
      }

      // Check maximum length requirement
      if (noteContent.trim().length > maxNoteLength) {
        this.errors['noteContent'] = `Note must be no more than ${maxNoteLength} characters long.`;
      }
    }
  }
}
