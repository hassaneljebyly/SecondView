import type { Categories } from "../api";
import { type VideoData } from "./youtube";

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

export function submitNotePayload(notePayload: NoteSubmissionPayload) {
  return new Promise((res) => {
    setTimeout(() => {
      res(JSON.stringify(notePayload));
    }, 3000);
  });
}
