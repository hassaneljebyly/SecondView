import type { FormInputData, StoredNoteData } from "../types";
import {
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  SEGMENT_LIMITS,
} from "./constant";
import {
  GlobalError,
  ValidationError,
  type GlobalErrorPayload,
  type ValidationErrorPayload,
} from "./error";
import {
  secondsToTimeString,
  timeStringIsValid,
  timeStringToSeconds,
} from "./timestamp";
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
  // [🐞 BUG]: account for fetch failure, deal with videoLength = 0 if getVideoDetails failed to get data
  const videoLength = Math.floor(getVideoDetails().videoLength || 0);
  // validate time bounds
  const startBoundIsValid = timeStringIsValid(startTime);
  const endBoundIsValid = timeStringIsValid(endTime);
  if (!startBoundIsValid) {
    errorsPayload["start"] = {
      message: startTime ? "Invalid Input (e.g. 02:40)" : "Required Field",
    };
  }
  if (!endBoundIsValid) {
    errorsPayload["end"] = {
      message: endTime ? "Invalid Input (e.g. 02:40)" : "Required Field",
    };
  }

  if (startBoundIsValid && endBoundIsValid) {
    const startBoundToSeconds = timeStringToSeconds(startTime);
    const endBoundToSeconds = timeStringToSeconds(endTime);
    const segmentLength = endBoundToSeconds - startBoundToSeconds;
    if (segmentLength >= 0 && segmentLength < SEGMENT_LIMITS.MIN_SECONDS) {
      console.log(startBoundToSeconds === 0);
      errorsPayload["end"] = {
        message: `Segment must be ≥${SEGMENT_LIMITS.MIN_SECONDS}s. Adjust start/end.`,
      };
    }
    // too long
    if (segmentLength > SEGMENT_LIMITS.MAX_SECONDS) {
      errorsPayload["end"] = {
        message: `Segment must be ≤${SEGMENT_LIMITS.MAX_SECONDS}s. Adjust start/end.`,
      };
    }
    // end bound bigger than start bound
    if (segmentLength < 0) {
      errorsPayload["end"] = {
        message: `End must come after start`,
      };
    }
    // [🧱 REFACTOR]: create functions to get current times or video duration
    // [🧱 REFACTOR]: remove videoLength from notes and move it to parent object
    // [🧱 REFACTOR]: best to use video.duration, cause some videos might not have notes
    const endTimeOutOfVideoBound = endBoundToSeconds > videoLength;
    if (endTimeOutOfVideoBound) {
      errorsPayload["end"] = {
        message: `Segment end cannot exceed video length (${secondsToTimeString(
          videoLength
        )})`,
      };
    }
    /*
       check if new segment overlaps with existing segments
       visual representation of overlap scenarios:
       e = endBoundToSeconds, s = startBoundToSeconds
      
                          start                end
      --------------------|====================|-----------------
        s      e       s      e
      --|======|-------|======|---|======|---|======|---|======|--
        no-overlap     overlap    overlap    overlap    no-overlap
    */

    if (notesList.length) {
      const overlappedSegment = notesList.find(({ startTime, endTime }) => {
        return startBoundToSeconds < endTime && endBoundToSeconds > startTime;
      });
      if (overlappedSegment) {
        console.log(overlappedSegment);
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
    errorsPayload["note"] = {
      message: noteContent
        ? `Note must be at least ${NOTE_LIMITS.MIN_LENGTH} characters long.`
        : "Required Field",
    };
  }

  if (noteContent.length > NOTE_LIMITS.MAX_LENGTH) {
    errorsPayload["note"] = {
      message: noteContent
        ? `Note must be no more than ${NOTE_LIMITS.MAX_LENGTH} characters long.`
        : "Required Field",
    };
  }

  if (!Object.keys(errorsPayload).length && !globalErrorPayload["global"]) {
    return true;
  }
  // segment overlap is a global error
  // since it concerns how more than one input influence each other (end and start input)
  // handle global errors separately to avoid overwhelming users
  if (globalErrorPayload["global"] && !Object.keys(errorsPayload).length) {
    throw new GlobalError(globalErrorPayload);
  }
  throw new ValidationError(errorsPayload);
}
