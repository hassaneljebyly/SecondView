import type { Prettify } from "./Prettify";

export type MisinformationType =
  | "FABRICATED_CONTENT"
  | "MANIPULATED_CONTENT"
  | "IMPOSTER_CONTENT"
  | "MISLEADING_CONTENT"
  | "FALSE_CONTEXT"
  | "SATIRE_AND_PARODY"
  | "FALSE_CONNECTIONS"
  | "SPONSORED_CONTENT"
  | "PROPAGANDA"
  | "ERROR"
  | "TEMPORAL_MISREPRESENTATION"
  | "UNSUBSTANTIATED_ADVICE";

export type MisinformationCategories = {
  [K in MisinformationType]: {
    value: K;
    displayName: string;
    description: string;
    color: string;
  };
};

export type FormInputData = {
  startTime: string;
  endTime: string;
  category: MisinformationType | "";
  noteContent: string;
};

export type NoteData = {
  startTime: number;
  endTime: number;
  category: MisinformationType;
  noteContent: string;
  sources: string[];
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
      submittedBy: string;
    }
>;

export type StoredNoteData = Prettify<
  NoteData & {
    id: string;
    submittedBy: string;
    createdAt: number;
  }
>;

export type GetNotesResponse = {
  videoId: string;
  notes: StoredNoteData[];
  videoLength: number;
};
