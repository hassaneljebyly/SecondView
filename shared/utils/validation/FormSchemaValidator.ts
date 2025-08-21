import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';
import { validFormFieldsSchema } from './helpers';

/**
 * First validator in the chain - validates that the form structure matches expected schema.
 * This acts as a security layer to ensure no fields have been added, removed, or changed types.
 * If this fails, subsequent validators should not run.
 */
export class FormSchemaValidator extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData, baseNoteFormFields } = context;
    // Validate form structure against expected schema
    if (!validFormFieldsSchema(formData, baseNoteFormFields)) {
      this.errors['form'] = 'Invalid form data!';
      this.errors['validFormSchema'] = false; // Stops the validation chain
    } else {
      this.errors['validFormSchema'] = true;
    }
  }
}
