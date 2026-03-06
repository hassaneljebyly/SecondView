import type { MisinfoTypeValues } from '@shared/types/noteConstrains';

import type { ApiResponse } from './responses';

export type VideoMetaData = {
  videoId: string;
  videoLength: number; // in seconds
};

export type Note = {
  startTimeSeconds: number;
  endTimeSeconds: number;
  category: MisinfoTypeValues;
  noteContent: string;
  sources: string[]; // parsed from noteContent
};

export type NoteSubmissionPayload = {
  videoMetaData: VideoMetaData;
  noteData: Note;
};

export type NoteStatus = 'active' | 'pending' | 'hidden';

export type NoteResponse = {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  misinfoType: MisinfoTypeValues;
  noteText: string;
  sources: string[];
  status: NoteStatus;
  createdAt: string | null;
  createdBy: string;
  alreadyRated: boolean;
  isOwn: boolean;
};

export type CreatedNoteResponse = {
  note: NoteResponse;
};

// Standard API response wrapping a User
export type SubmitNoteResponse = ApiResponse<CreatedNoteResponse>;
