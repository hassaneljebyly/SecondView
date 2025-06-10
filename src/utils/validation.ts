import type { FormDataType } from "../components/Note";
import { NOTE_FORM_PLACEHOLDERS, NOTE_LIMITS } from "./constant";
import { timeStringIsValid } from "./timestamp";

export type NoteFormInputFields = keyof FormDataType;
export type ValidationError = {
  field: NoteFormInputFields;
  message: string;
};

export function validateNoteFormData(
  formData: FormDataType
): ValidationError[] | [] {
  const errors: ValidationError[] = [];
  // validate timestamp input
  const { start, end } = formData;
  if (!timeStringIsValid(start)) {
    errors.push({
      field: "start",
      message: start ? "Invalid time input" : "Required Field",
    });
  }
  if (!timeStringIsValid(end)) {
    errors.push({
      field: "end",
      message: end ? "Invalid time input" : "Required Field",
    });
  }

  const { category } = formData;
  if (
    !(NOTE_FORM_PLACEHOLDERS.CATEGORIES as unknown as string).includes(category)
  ) {
    errors.push({
      field: "category",
      message: category ? "Invalid input" : "Required Field",
    });
  }

  const { note } = formData;
  if (note.length < NOTE_LIMITS.MIN_LENGTH) {
    errors.push({
      field: "note",
      message: note
        ? `Note must be at least ${NOTE_LIMITS.MIN_LENGTH} characters long.`
        : "Required Field",
    });
  }

  if (note.length > NOTE_LIMITS.MAX_LENGTH) {
    errors.push({
      field: "note",
      message: note
        ? `Note must be no more than ${NOTE_LIMITS.MAX_LENGTH} characters long.`
        : "Required Field",
    });
  }

  return errors;
}
