import type { Categories } from "../api";
import type { Prettify } from "./Prettify";

export type FormInputData = {
  startTime: string;
  endTime: string;
  category: Categories | "";
  noteContent: string;
};

export type NoteData = {
  startTime: number;
  endTime: number;
  category: Categories;
  noteContent: string;
};

export type VideoMetaData = {
  videoId: string;
  channelId: string;
  channelName: string;
  videoTitle: string;
  videoLength: number;
};

export type SubmitNoteRequest = Prettify<
  VideoMetaData &
    NoteData & {
      createdBy: string;
    }
>;

export type StoredNoteData = NoteData & {
  id: string;
  submittedBy: string;
  createdAt: number;
};

export type GetNotesResponse = {
  videoId: string;
  notes: StoredNoteData[];
};
