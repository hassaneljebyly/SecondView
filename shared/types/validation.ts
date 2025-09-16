import type { NoteCategoryKeysArray } from './noteConstrains';
import type { FormInputData, Note } from './schemas';

export type FormInputDataFields = keyof FormInputData;
export type NoteFormErrorObjectTarget = FormInputDataFields | 'form';

export type TimeStampRegexResult = {
  hours: string | undefined;
  minutes: string | undefined;
  seconds: string | undefined;
};

export type ValidationConfig = {
  baseNoteFormFields: FormInputData;
  formData: FormInputData;
  existingNotes: Note[];
  videoLength: number;
  timeStampRegex: RegExp;
  minSegmentLength: number;
  maxSegmentLength: number;
  maxNoteLength: number;
  minNoteLength: number;
  noteCategories: NoteCategoryKeysArray;
  validLinksFormat: RegExp;
};

export type ValidationErrors = {
  [T in NoteFormErrorObjectTarget]?: string;
} & {
  validFormSchema?: boolean;
};

export type ValidationResult =
  | { formIsValid: true; formData: ValidationConfig['formData'] }
  | { formIsValid: false; errors: ValidationErrors };
