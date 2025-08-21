import type { NoteCategoryKeys } from '@shared/types/noteConstrains';
import type { ValidationConfig } from '@shared/types/validation';

import { ValidationHandler } from './AbstractValidationHandler';

/**
 * Validates that the selected category is from the allowed list of categories.
 * Prevents invalid or malicious category values from being submitted.
 */
export class MissInfoCategoryValidator extends ValidationHandler {
  constructor() {
    super();
  }
  protected override handle(context: ValidationConfig): void {
    const { formData, noteCategories } = context;
    const { category } = formData;
    // Only validate if category field doesn't already have an error
    if (!this.errors['category'] && !noteCategories.includes(category as NoteCategoryKeys)) {
      // Check if the selected category is in the allowed list
      this.errors['category'] = 'Invalid Input';
    }
  }
}
