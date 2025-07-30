/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  GetNotesResponse,
  NoteRating,
  SubmitNoteRequest,
} from "../../types";

export default abstract class NotesRepository {
  async getNotes(_videoId: string): Promise<GetNotesResponse | null> {
    throw new Error("Not Implemented");
  }
  async addNote(_payload: SubmitNoteRequest): Promise<void> {
    throw new Error("Not Implemented");
  }
  async addNoteRating(_payload: NoteRating, _noteId: string): Promise<void> {
    throw new Error("Not Implemented");
  }

  async getNoteRating(_noteId: string): Promise<NoteRating[]> {
    throw new Error("Not Implemented");
  }
}
