import type { StoredNoteData, SubmitNoteRequest } from "../types";
import { createRandomId } from "./helpers";

export function createStoredNoteDataFromPayLoad(
  payload: SubmitNoteRequest
): StoredNoteData {
  const { startTime, endTime, category, noteContent, submittedBy } = payload;
  return {
    // [🚀 FEATURE]: get actual user id
    id: createRandomId(),
    createdAt: Date.now(),
    startTime,
    endTime,
    category,
    noteContent,
    submittedBy,
  };
}
