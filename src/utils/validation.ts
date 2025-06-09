import type { FormDataType } from "../components/Note";
import { timeStringIsValid } from "./timestamp";

export type NoteFormInputFields = keyof FormDataType;
export type ValidationError = {
  field: NoteFormInputFields;
  message: string;
};

const categories = [
  "SELECT_NOTE_CATEGORY",
  "FABRICATED_CONTENT",
  "MANIPULATED_CONTENT",
  "IMPOSTER_CONTENT",
  "MISLEADING_CONTENT",
  "FALSE_CONTEXT",
  "SATIRE_AND_PARODY",
  "FALSE_CONNECTIONS",
  "SPONSORED_CONTENT",
  "PROPAGANDA",
  "ERROR",
];

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
  if (!categories.includes(category.toUpperCase().replace("-", "_"))) {
    errors.push({
      field: "category",
      message: category ? "Invalid input" : "Required Field",
    });
  }

  const { note } = formData;
  if (note.length < 5) {
    errors.push({
      field: "note",
      message: note
        ? "Note must be at least 5 characters long."
        : "Required Field",
    });
  }

  if (note.length > 500) {
    errors.push({
      field: "note",
      message: note
        ? "Note must be no more than 500 characters long."
        : "Required Field",
    });
  }

  return errors;
}
