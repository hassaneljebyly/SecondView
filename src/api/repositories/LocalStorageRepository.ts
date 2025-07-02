import type {
  GetNotesResponse,
  StoredNoteData,
  SubmitNoteRequest,
} from "../../types";
import { GlobalError } from "../../utils/error";
import { createStoredNoteDataFromPayLoad } from "../state/NotesCache";
import NotesRepository from "./NotesRepository";

class LocalStorageRepository extends NotesRepository {
  async getNotes(videoId: string): Promise<GetNotesResponse | null> {
    try {
      const storedData = await chrome.storage.local.get(videoId);
      const noteData: GetNotesResponse | null = storedData[videoId] || null;
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
    console.log("payload :", payload);

    try {
      const videoId = payload["videoId"];
      const storedData = await chrome.storage.local.get(videoId);
      console.log("storedData :", storedData);
      const noteData: GetNotesResponse | null = storedData[videoId] || null;
      const newNote: StoredNoteData = createStoredNoteDataFromPayLoad(payload);
      const newStoredNoteData: GetNotesResponse = {
        videoId,
        notes: noteData ? [...noteData.notes, newNote] : [newNote],
        videoLength: payload.videoLength,
      };
      console.log("newStoredNoteData: ", newStoredNoteData);
      await chrome.storage.local.set({
        [videoId]: newStoredNoteData,
      });
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

export const dbLocalstorage = new LocalStorageRepository();
