import type { StoredNoteData, SubmitNoteRequest } from "../types";
import { createRandomId } from "./helpers";

export function createStoredNoteDataFromPayLoad(
  payload: SubmitNoteRequest
): StoredNoteData {
  return {
    // [🚀 FEATURE]: get actual user id
    id: createRandomId(),
    createdAt: Date.now(),
    ...payload,
  };
}
