import type { StoredNoteData, SubmitNoteRequest } from "../types";
import { REGEX } from "./constant";
import { createRandomId } from "./helpers";

export function createStoredNoteDataFromPayLoad(
  payload: SubmitNoteRequest
): StoredNoteData {
  // [🚀 FEATURE]: verify note data before sending it to be stored
  return {
    // [🚀 FEATURE]: get actual user id
    id: createRandomId(),
    createdAt: Date.now(),
    ...payload,
  };
}

export function getSourcesFromNoteContent(text: string): string[] {
  const matchedLinks = text.match(REGEX.ACCEPTED_LINKS_FORMAT);
  const result = matchedLinks ? [...matchedLinks] : [];
  return result;
}
