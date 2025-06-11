import type { FormDataType } from "../components/note-submission-form";
import {
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  SEGMENT_LIMITS,
} from "./constant";
import { timeStringIsValid, timeStringToSeconds } from "./timestamp";

export type NoteFormInputFields = keyof FormDataType;
export type ValidationError = {
  field: NoteFormInputFields;
  message: string;
};
// !FIXME: case of end bound is bigger than video length is not covered yet
export function validateNoteFormData(
  formData: FormDataType
): ValidationError[] | [] {
  const errors: ValidationError[] = [];
  // validate timestamp input
  const { start, end } = formData;
  const validStartTimeBound = timeStringIsValid(start);
  const validEndTimeBound = timeStringIsValid(end);
  if (!validStartTimeBound) {
    errors.push({
      field: "start",
      message: start
        ? "Time format: seconds (30), minutes:seconds (1:30), or hours:minutes:seconds (1:05:30)"
        : "Required Field",
    });
  }
  if (!validEndTimeBound) {
    errors.push({
      field: "end",
      message: end
        ? "Time format: seconds (30), minutes:seconds (1:30), or hours:minutes:seconds (1:05:30)"
        : "Required Field",
    });
  }

  if (validStartTimeBound && validEndTimeBound) {
    const startBoundToSeconds = timeStringToSeconds(start);
    const endBoundToSeconds = timeStringToSeconds(end);
    const segmentLength = endBoundToSeconds - startBoundToSeconds;
    let error: ValidationError | null = null;
    // too short
    if (segmentLength >= 0 && segmentLength < SEGMENT_LIMITS.MIN_SECONDS) {
      error = {
        field: "end",
        message: `Segment should be at least ${SEGMENT_LIMITS.MIN_SECONDS}s long, consider editing end or start`,
      };
    }
    // too long
    if (segmentLength > SEGMENT_LIMITS.MAX_SECONDS) {
      error = {
        field: "end",
        message: `Segment should be max ${SEGMENT_LIMITS.MAX_SECONDS}s long, consider editing end or start`,
      };
    }
    // end bound bigger than start bound
    if (segmentLength < 0) {
      error = {
        field: "end",
        message: `end must come after start`,
      };
    }

    if (error) errors.push(error);
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
