import {
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  SEGMENT_LIMITS,
} from "./constant";
import type { FormData } from "./data";
import { ValidationError, type ValidationErrorPayload } from "./error";
import { timeStringIsValid, timeStringToSeconds } from "./timestamp";

// FIXME: case of end bound is bigger than video length is not covered yet
export function validateFormData(formData: FormData): true | never {
  const { start, end, category, note } = formData;
  const errorsPayload: ValidationErrorPayload = {};
  // validate time bounds
  const startBoundIsValid = timeStringIsValid(start);
  const endBoundIsValid = timeStringIsValid(end);
  if (!startBoundIsValid) {
    errorsPayload["start"] = {
      focus: false,
      message: start ? "Invalid Input (e.g. 02:40)" : "Required Field",
    };
  }
  if (!endBoundIsValid) {
    errorsPayload["end"] = {
      focus: false,
      message: end ? "Invalid Input (e.g. 02:40)" : "Required Field",
    };
  }

  if (startBoundIsValid && endBoundIsValid) {
    const startBoundToSeconds = timeStringToSeconds(start);
    const endBoundToSeconds = timeStringToSeconds(end);
    const segmentLength = endBoundToSeconds - startBoundToSeconds;
    if (segmentLength >= 0 && segmentLength < SEGMENT_LIMITS.MIN_SECONDS) {
      errorsPayload["end"] = {
        focus: false,
        message: `Segment must be ≥${SEGMENT_LIMITS.MIN_SECONDS}s. Adjust start/end.`,
      };
    }
    // too long
    if (segmentLength > SEGMENT_LIMITS.MAX_SECONDS) {
      errorsPayload["end"] = {
        focus: false,
        message: `Segment must be ≤${SEGMENT_LIMITS.MAX_SECONDS}s. Adjust start/end.`,
      };
    }
    // end bound bigger than start bound
    if (segmentLength < 0) {
      errorsPayload["end"] = {
        focus: false,
        message: `End must come after start`,
      };
    }
  }

  // validate category
  if (
    !(NOTE_FORM_PLACEHOLDERS.CATEGORIES as unknown as string).includes(category)
  ) {
    errorsPayload["category"] = {
      focus: false,
      message: category ? "Invalid input" : "Required Field",
    };
  }

  // validate note
  if (note.length < NOTE_LIMITS.MIN_LENGTH) {
    errorsPayload["note"] = {
      focus: false,
      message: note
        ? `Note must be at least ${NOTE_LIMITS.MIN_LENGTH} characters long.`
        : "Required Field",
    };
  }

  if (note.length > NOTE_LIMITS.MAX_LENGTH) {
    errorsPayload["note"] = {
      focus: false,
      message: note
        ? `Note must be no more than ${NOTE_LIMITS.MAX_LENGTH} characters long.`
        : "Required Field",
    };
  }

  if (!Object.keys(errorsPayload).length) {
    return true;
  }
  throw new ValidationError(errorsPayload);
}
