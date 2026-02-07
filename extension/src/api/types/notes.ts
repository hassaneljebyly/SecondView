import type { ApiResponse } from './responses';

type NoteCategoryKeys =
  | 'TEMPORAL_MISREPRESENTATION'
  | 'UNSUBSTANTIATED_ADVICE'
  | 'MANIPULATED_CONTENT'
  | 'FABRICATED_CONTENT'
  | 'MISLEADING_CONTENT'
  | 'SATIRE_AND_PARODY'
  | 'FALSE_CONNECTIONS'
  | 'SPONSORED_CONTENT'
  | 'IMPOSTER_CONTENT'
  | 'FALSE_CONTEXT'
  | 'PROPAGANDA'
  | 'ERROR';

export type VideoMetaData = {
  videoId: string;
  videoLength: number; // in seconds
};

export type Note = {
  startTimeSeconds: number;
  endTimeSeconds: number;
  category: NoteCategoryKeys;
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
  misinfoType: NoteCategoryKeys;
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
