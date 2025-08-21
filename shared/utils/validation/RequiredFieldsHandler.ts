import type { Entries } from '@shared/types/helpers';
import type { FormInputData } from '@shared/types/schemas';
import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';

/**
 * Validates that all required form fields are not empty.
 * Checks each field for non-empty trimmed values.
 */
export class RequiredFieldsHandler extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData } = context;
    // Check each form field for empty values
    for (const [field, value] of Object.entries(formData) as Entries<FormInputData>[]) {
      if (value.trim().length === 0) {
        this.errors[field] = 'Required field';
      }
    }
  }
}
