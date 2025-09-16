import type { NoteCategoryKeys } from './noteConstrains';
import type { VideoMetaData } from './youtube-data';

export type FormInputData = {
  startTime: string;
  endTime: string;
  category: string;
  noteContent: string;
};

export type Note = {
  userId: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
  category: NoteCategoryKeys;
  noteContent: string;
  sources: string[];
};

export type NoteSubmissionPayload = {
  videoMetaData: VideoMetaData;
  note: Note;
};

export type NotesFromStorage = Note & { noteId: number };

export type NoteRequestPayload = {
  videoMetaData: VideoMetaData;
  noteList: NotesFromStorage[];
};
