import { getNotes } from "../api";
import {
  NOTE_FORM_PLACEHOLDERS,
  NOTE_LIMITS,
  SEGMENT_LIMITS,
} from "./constant";
import type { FormData } from "./data";
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

export function validateFormData(formData: FormData): true | never {
  const { start, end, category, note } = formData;
  const noteList = getNotes().notes;
  const errorsPayload: ValidationErrorPayload = {};
  const globalErrorPayload: GlobalErrorPayload = {};
  // [🐞 BUG]: deal with videoLength = 0 if getVideoDetails failed to get data
  const videoLength = Math.floor(getVideoDetails().videoLength || 0);
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
      console.log(startBoundToSeconds === 0);
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
    // [🧱 REFACTOR]: create functions to get current times or video duration
    // [🧱 REFACTOR]: remove videoLength from notes and move it to parent object
    // [🧱 REFACTOR]: best to use video.duration, cause some videos might not have notes
    const endTimeOutOfVideoBound = endBoundToSeconds > videoLength;
    if (endTimeOutOfVideoBound) {
      errorsPayload["end"] = {
        focus: false,
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

    if (noteList.length) {
      const overlappedSegment = noteList.find(({ start, end }) => {
        return startBoundToSeconds < end && endBoundToSeconds > start;
      });
      if (overlappedSegment) {
        console.log(overlappedSegment);
        const overlapStart = secondsToTimeString(overlappedSegment.start);
        const overlapEnd = secondsToTimeString(overlappedSegment.end);
        globalErrorPayload["global"] = {
          target: "form",
          message: `Someone already added a note for ${overlapStart}-${overlapEnd} and your note overlaps with it - choose a different time range or check the existing note.`,
        };
      }
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
