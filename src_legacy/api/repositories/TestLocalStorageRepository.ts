/**
 * for testing in local storage only
 */

import type {
  GetNotesResponse,
  NoteRating,
  StoredNoteData,
  SubmitNoteRequest,
} from "../../types";
import { createStoredNoteDataFromPayLoad, GlobalError } from "../../utils";
import NotesRepository from "./NotesRepository";

export default class TestLocalStorageRepository extends NotesRepository {
  async getNotes(videoId: string): Promise<GetNotesResponse | null> {
    try {
      const storedData = await JSON.parse(
        window.localStorage.getItem(videoId) || "{}"
      );
      const noteData: GetNotesResponse | null = storedData
        ? storedData[videoId]
        : null;
      return noteData;
    } catch (error) {
      console.error(
        "Something went wrong while trying to retrieve notes: ",
        error
      );
      throw new GlobalError({
        global: {
          target: "form",
          message: "Something went wrong while trying to retrieve notes",
        },
      });
    }
  }

  async addNote(payload: SubmitNoteRequest): Promise<void> {
    try {
      const videoId = payload["videoId"];
      const storedData = await JSON.parse(
        window.localStorage.getItem(videoId) || "{}"
      );
      const noteData: GetNotesResponse | null = storedData
        ? storedData[videoId]
        : null;
      const newNote: StoredNoteData = createStoredNoteDataFromPayLoad(payload);
      const newStoredNoteData: GetNotesResponse = {
        videoId,
        notes: noteData ? [...noteData.notes, newNote] : [newNote],
        videoLength: payload.videoLength,
      };
      window.localStorage.setItem(
        videoId,
        JSON.stringify({ [videoId]: newStoredNoteData })
      );
    } catch (error) {
      console.error("Something went wrong while trying to save note: ", error);
      throw new GlobalError({
        global: {
          target: "form",
          message: "Something went wrong while trying to save note",
        },
      });
    }
  }

  async addNoteRating(payload: NoteRating, noteId: string): Promise<void> {
    try {
      const noteRatingKey = `note_rating_${noteId}`;

      const noteRatingInStorage = JSON.parse(
        localStorage.getItem(noteRatingKey) || "{}"
      ) as { [key: string]: NoteRating[] };

      const ratingData = noteRatingInStorage[noteRatingKey] || [];
      ratingData.push(payload);
      localStorage.setItem(
        noteRatingKey,
        JSON.stringify({ [noteRatingKey]: ratingData })
      );
    } catch (error) {
      console.error(
        "Something went wrong while trying to save notes rating:",
        error
      );
      throw new GlobalError({
        global: {
          target: "form",
          message: "Something went wrong while trying to save notes rating",
        },
      });
    }
  }
  async getNoteRating(noteId: string): Promise<NoteRating[]> {
    try {
      const noteRatingKey = `note_rating_${noteId}`;
      const noteRatingInStorage = JSON.parse(
        localStorage.getItem(noteRatingKey) || "{}"
      ) as { [key: string]: NoteRating[] };
      return noteRatingInStorage[noteRatingKey] || [];
    } catch (error) {
      console.error(
        "Something went wrong while trying to get notes rating:",
        error
      );
      throw new GlobalError({
        global: {
          target: "form",
          message: "Something went wrong while trying to get notes rating",
        },
      });
    }
  }
}
