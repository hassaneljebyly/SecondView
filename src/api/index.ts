import type { GetNotesResponse } from "../types";
import { localTestData, youtubeTestData } from "./mock-data";

export function getNotes(): GetNotesResponse {
  return import.meta.env.DEV ? localTestData : youtubeTestData;
}
