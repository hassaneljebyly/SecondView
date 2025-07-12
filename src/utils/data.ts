import type {
  AccurateRatingName,
  InaccurateRatingName,
  Tabs,
} from "../components/note-rating";
import type { NoteRating, StoredNoteData, SubmitNoteRequest } from "../types";
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

export function createNoteRatingData(
  ratingValues: (AccurateRatingName | InaccurateRatingName)[],
  activeTab: Tabs,
  id: string
): NoteRating {
  // remove potentially duplicate values
  const uniqueRatingValues = [...new Set(ratingValues)];
  const accurateRatings = (
    activeTab === "accurate" ? uniqueRatingValues : []
  ) as AccurateRatingName[];
  const inaccurateRatings = (
    activeTab === "inaccurate" ? uniqueRatingValues : []
  ) as InaccurateRatingName[];
  return {
    noteId: id,
    // get actual current user Id
    ratedBy: createRandomId(),
    accurateRatings,
    inaccurateRatings,
    overallHelpful: activeTab === "accurate",
    // [🚀 FEATURE]: all createdAt should be created in backend
    createdAt: Date.now(),
  };
}

export function removeDuplicateRatingValues(
  ratingValues: (AccurateRatingName | InaccurateRatingName)[]
) {
  const uniqueRatingValues = new Set(ratingValues);
  return [...uniqueRatingValues];
}
