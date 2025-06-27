import type { Categories } from "../api";
import { PREFIX } from "./constant";
import { timeStringToSeconds } from "./timestamp";
import { getVideoDetails, type VideoData } from "./youtube";

export type FormData = {
  start: string;
  end: string;
  category: Categories;
  note: string;
};

export type NoteData = {
  start: number;
  end: number;
  category: string;
  note: string;
};

export type NoteSubmissionPayload = {
  videoData: VideoData;
  noteData: NoteData;
  userId: string;
  timestamp: number;
};

export function prepareSubmissionPayload(
  formData: FormData
): NoteSubmissionPayload {
  const videoData: VideoData = getVideoDetails();
  const noteData: NoteData = {
    ...formData,
    start: timeStringToSeconds(formData.start),
    end: timeStringToSeconds(formData.end),
  };
  // [🚀 FEATURE]:  add userId
  return {
    videoData,
    noteData,
    userId: "",
    timestamp: Date.now(),
  };
}

export function normalizeFormData(formDataObject: {
  [k: string]: FormDataEntryValue;
}) {
  const dataDefault: FormData = {
    start: "",
    end: "",
    // @ts-expect-error: empty string used as placeholder, validated later
    category: "",
    note: "",
  };

  for (const [key, value] of Object.entries(formDataObject)) {
    // remove prefix
    const keyWithRemovedPrefix = key.replace(PREFIX, "") as keyof FormData;
    // only accept predefined form fields to prevent malicious, accidental or intentional form tempering
    // typeof value === "string" solves (Type 'File' is not assignable to type 'string') error
    if (keyWithRemovedPrefix in dataDefault && typeof value === "string") {
      // @ts-expect-error: allow empty string placeholder will be validated later
      dataDefault[keyWithRemovedPrefix] = value.trim();
    } else {
      console.error(`Invalid data entry`);
    }
  }

  return dataDefault;
}

export function submitNotePayload(notePayload: NoteSubmissionPayload) {
  return new Promise((res) => {
    setTimeout(() => {
      res(JSON.stringify(notePayload));
    }, 3000);
  });
}
