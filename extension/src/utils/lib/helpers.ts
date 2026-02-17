import type { NoteResponse } from '@/api/types/notes';

type SegmentPercentParams = {
  videoLength: number;
  startTime: number;
  endTime: number;
};

type SegmentPercentResult = {
  segmentWidth: string;
  segmentLeftPos: string;
};

/**
 * Calculates the percentage width and left position of a video segment
 * relative to the full video length.
 *
 * @param {SegmentPercentParams} params - The function parameters.
 * @returns {SegmentPercentResult} - The percentage width and left position.
 *
 * @example
 * getSegmentPercentRange({ videoLength: 100, startTime: 25, endTime: 50 });
 * // => { segmentWidth: "25.00%", segmentLeftPos: "25.00%" }
 */
export function getSegmentPercentRange({
  videoLength,
  startTime,
  endTime,
}: SegmentPercentParams): SegmentPercentResult {
  if (videoLength <= 0) {
    return { segmentWidth: '0%', segmentLeftPos: '0%' };
  }

  const widthPct = ((endTime - startTime) / videoLength) * 100;
  const leftPct = (startTime / videoLength) * 100;

  return {
    segmentWidth: `${widthPct.toFixed(2)}%`,
    segmentLeftPos: `${leftPct.toFixed(2)}%`,
  };
}

/**
 * Builds a map of notes keyed by their `endTimeSeconds`.
 *
 * Using a Map instead of sorting allows O(1) lookups when handling
 * the `timeupdate` event — we can directly access notes by the floored
 * currentTime without repeatedly sorting or scanning the list.
 *
 * Assumptions:
 * - Notes do not overlap.
 * - Each note has a unique `endTimeSeconds`.
 *
 * @param noteList - Array of notes loaded from storage.
 * @returns Map keyed by `endTimeSeconds` for fast lookups.
 */
export function buildNotesMap(noteList: NoteResponse[]) {
  const notesMap = new Map<number, NoteResponse>();
  for (const note of noteList) {
    const { endTime } = note;
    notesMap.set(endTime, note);
  }
  return notesMap;
}

export const ENV_KEYS = [
  'VITE_SUPABASE_SUBMIT_RATING_URL',
  'VITE_SUPABASE_SUBMIT_NOTE_URL',
  'VITE_SUPABASE_FETCH_NOTES_URL',
  'VITE_SUPABASE_CREATE_USER_URL',
  'VITE_SUPABASE_SYNC_PROFILE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

type EnvKeys = (typeof ENV_KEYS)[number];

export function getEnvKeys(envKeys: EnvKeys) {
  return import.meta.env[envKeys];
}

export function mapValuesToArray<K, V>(map: Map<K, V>): V[] {
  return Array.from(map.values());
}
