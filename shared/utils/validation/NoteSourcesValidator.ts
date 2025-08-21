import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';

/**
 * Validates that the note content includes at least one valid source link.
 * Ensures that notes are backed by credible sources for fact-checking purposes.
 */
export class NoteSourcesValidator extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData, validLinksFormat } = context;
    const { noteContent } = formData;
    // Only validate if note content doesn't already have an error
    // Check if note content contains at least one valid link pattern
    if (!this.errors['noteContent'] && noteContent.trim().match(validLinksFormat) === null) {
      this.errors['noteContent'] = `Please include at least one valid link to a source.`;
    }
  }
}
