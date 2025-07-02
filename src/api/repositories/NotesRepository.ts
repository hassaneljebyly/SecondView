/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GetNotesResponse, SubmitNoteRequest } from "../../types";

export default abstract class NotesRepository {
  async getNotes(_videoId: string): Promise<GetNotesResponse | null> {
    throw new Error("Not Implemented");
  }
  async addNote(_payload: SubmitNoteRequest): Promise<void> {
    throw new Error("Not Implemented");
  }
}
