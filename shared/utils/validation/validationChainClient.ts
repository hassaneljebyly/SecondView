import type { ValidationConfig } from '@shared/types/validation';

import { EndWithinBoundsValidator } from './EndWithinBoundsValidator';
import { FormSchemaValidator } from './FormSchemaValidator';
import { MisInfoCategoryValidator } from './MisInfoCategoryValidator';
import { NoteLengthValidator } from './NoteLengthValidator';
import { NoteSourcesValidator } from './NoteSourcesValidator';
import { RequiredFieldsHandler } from './RequiredFieldsHandler';
import { SegmentMaxLengthValidator } from './SegmentMaxLengthValidator';
import { SegmentMinLengthValidator } from './SegmentMinLengthValidator';
import { SegmentsOverlapValidator } from './SegmentsOverlapValidator';
import { TimeStampPatternHandler } from './TimeStampPatternHandler';

/**
 * Validates a form submission against a chain of validation handlers.
 * This function builds a validation chain (using the Chain of Responsibility pattern),
 * executes all validation steps, and returns a summary object indicating whether
 * the form is valid and the associated form data.
 *
 * @param validationConfig - The configuration and data to be validated.
 * @returns An object with:
 * - `formIsValid`: boolean indicating overall form validity
 * - `formData`: the raw form data extracted from the validationConfig
 */
export function validateForm(validationConfig: ValidationConfig) {
  const validationChain = buildValidationChain();
  validationChain.validate(validationConfig, {});
  const formIsValid = !Object.keys(validationChain.getErrors()).length;
  const formData = validationConfig['formData'];
  return { formIsValid, formData };
}

/**
 * Builds the validation chain for a note form.
 * Validators are linked in sequence; each handler may
 * validate and pass control to the next.
 *
 * @returns The root handler of the validation chain.
 */
function buildValidationChain() {
  const noteFormChain = new FormSchemaValidator(); // ensures the form submitted has valid schema

  noteFormChain
    .setNext(new RequiredFieldsHandler()) // ensure all required fields are present
    .setNext(new TimeStampPatternHandler()) // validate timestamp format
    .setNext(new SegmentMinLengthValidator()) // enforce minimum segment length
    .setNext(new SegmentMaxLengthValidator()) // enforce maximum segment length
    .setNext(new EndWithinBoundsValidator()) // ensure segment end time is within video length
    .setNext(new SegmentsOverlapValidator()) // check that segments don’t overlap
    .setNext(new MisInfoCategoryValidator()) // validate misInfo type
    .setNext(new NoteLengthValidator()) // enforce max/min note length
    .setNext(new NoteSourcesValidator()); // Validate note has link to sources

  return noteFormChain;
}
