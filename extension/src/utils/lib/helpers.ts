import type { NotesFromStorage } from '@shared/types/schemas';

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
export function buildNotesMap(noteList: NotesFromStorage[]) {
  const notesMap = new Map<number, NotesFromStorage>();
  for (const note of noteList) {
    const { endTimeSeconds } = note;
    notesMap.set(endTimeSeconds, note);
  }
  return notesMap;
}
