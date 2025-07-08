import type { FormInputData, StoredNoteData } from "../types";
import {
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  REGEX,
  SEGMENT_LIMITS,
} from "./constant";
import {
  GlobalError,
  InputValidationError,
  type GlobalErrorPayload,
  type ValidationErrorPayload,
} from "./error";
import { secondsToTimeString, timeStringToSeconds } from "./timestamp";
import { getVideoDetails } from "./youtube";

export function validateFormData(
  formData: FormInputData,
  notesList: StoredNoteData[]
): true | never {
  const requiredFields: (keyof FormInputData)[] = [
    "startTime",
    "endTime",
    "category",
    "noteContent",
  ];
  // only accept predefined form fields to prevent malicious, accidental or intentional form tempering
  // typeof value === "string" solves (Type 'File' is not assignable to type 'string') error
  const allFieldsExistAndStringType = requiredFields.every(
    (field) =>
      Object.hasOwn(formData, field) && typeof formData[field] === "string"
  );
  if (!allFieldsExistAndStringType) {
    throw new GlobalError({
      global: {
        target: "form",
        message: "Invalid data entry",
      },
    });
  }

  const { startTime, endTime, category, noteContent } = formData;
  const errorsPayload: ValidationErrorPayload = {};
  const globalErrorPayload: GlobalErrorPayload = {};
  const videoLength = getVideoDetails().videoLength;
  // validate time bounds
  const startBoundIsValid = timeStringIsValid(startTime);
  const endBoundIsValid = timeStringIsValid(endTime);
  if (!startBoundIsValid) {
    errorsPayload["startTime"] = {
      message: startTime ? "Invalid Input (e.g. 02:40)" : "Required Field",
    };
  }
  if (!endBoundIsValid) {
    errorsPayload["endTime"] = {
      message: endTime ? "Invalid Input (e.g. 02:40)" : "Required Field",
    };
  }

  if (startBoundIsValid && endBoundIsValid) {
    const startTimeInSeconds = timeStringToSeconds(startTime);
    const endTimeInSeconds = timeStringToSeconds(endTime);
    const segmentLength = endTimeInSeconds - startTimeInSeconds;
    if (segmentLength >= 0 && segmentLength < SEGMENT_LIMITS.MIN_SECONDS) {
      errorsPayload["endTime"] = {
        message: `Segment must be ≥${SEGMENT_LIMITS.MIN_SECONDS}s. Adjust start/end.`,
      };
    }
    // too long
    if (segmentLength > SEGMENT_LIMITS.MAX_SECONDS) {
      errorsPayload["endTime"] = {
        message: `Segment must be ≤${SEGMENT_LIMITS.MAX_SECONDS}s. Adjust start/end.`,
      };
    }
    // end bound bigger than start bound
    if (segmentLength < 0) {
      errorsPayload["endTime"] = {
        message: `End must come after start`,
      };
    }
    const endTimeOutOfVideoBound = endTimeInSeconds > videoLength;
    if (endTimeOutOfVideoBound) {
      errorsPayload["endTime"] = {
        message: `Segment end cannot exceed video length (${secondsToTimeString(
          videoLength
        )})`,
      };
    }
    /*
       check if new segment overlaps with existing segments
       visual representation of overlap scenarios:
       e = endTimeInSeconds, s = startTimeInSeconds
      
                          startTime            endTime
      --------------------|====================|-----------------
        s      e       s      e   s      e   s      e   s      e
      --|======|-------|======|---|======|---|======|---|======|--
        no-overlap     overlap    overlap    overlap    no-overlap
    */

    if (notesList.length) {
      const overlappedSegment = notesList.find(({ startTime, endTime }) => {
        return startTimeInSeconds < endTime && endTimeInSeconds > startTime;
      });
      if (overlappedSegment) {
        const overlapStart = secondsToTimeString(overlappedSegment.startTime);
        const overlapEnd = secondsToTimeString(overlappedSegment.endTime);
        globalErrorPayload["global"] = {
          target: "form",
          message: `Someone already added a note for ${overlapStart}-${overlapEnd} and your note overlaps with it - choose a different time range or check the existing note.`,
        };
      }
    }
  }

  // validate category
  if (!category || !NOTE_FORM_PLACEHOLDERS.CATEGORIES.includes(category)) {
    errorsPayload["category"] = {
      message: category ? "Invalid input" : "Required Field",
    };
  }

  // validate note
  if (noteContent.length < NOTE_LIMITS.MIN_LENGTH) {
    errorsPayload["noteContent"] = {
      message: noteContent
        ? `Note must be at least ${NOTE_LIMITS.MIN_LENGTH} characters long.`
        : "Required Field",
    };
  }
  if (noteContent.length > NOTE_LIMITS.MAX_LENGTH) {
    errorsPayload["noteContent"] = {
      message: `Note must be no more than ${NOTE_LIMITS.MAX_LENGTH} characters long.`,
    };
  }

  if (
    noteContent.length > NOTE_LIMITS.MIN_LENGTH &&
    !REGEX.ACCEPTED_LINKS_FORMAT.test(noteContent)
  ) {
    errorsPayload["noteContent"] = {
      message: "Please include at least one valid link to a source.",
    };
  }

  if (!Object.keys(errorsPayload).length && !globalErrorPayload["global"]) {
    return true;
  }
  // segment overlap is a global error
  // since it concerns how more than one input influence each other (startTime and endTime input)
  // handle global errors separately to avoid overwhelming users
  if (globalErrorPayload["global"] && !Object.keys(errorsPayload).length) {
    throw new GlobalError(globalErrorPayload);
  }
  throw new InputValidationError(errorsPayload);
}

export function timeStringIsValid(timeStamp: string): boolean {
  const testRegex = new RegExp(REGEX.TIME_STAMP_PATTERN);
  return testRegex.test(timeStamp);
}
