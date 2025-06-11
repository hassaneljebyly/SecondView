import type { VideoDetails } from "../utils";

export type FormDataType = {
  start: string;
  end: string;
  category: string;
  note: string;
};

export type NoteSubmissionData = VideoDetails & {
  // form data (converted)
  startSeconds: number;
  endSeconds: number;
  category: string;
  note: string;
  // submission metadata
  userId: string; // generated ID
  timestamp: number; // Date.now()
};
