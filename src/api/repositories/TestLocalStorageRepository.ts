/**
 * for testing in local storage only
 */

import type {
  GetNotesResponse,
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
}
