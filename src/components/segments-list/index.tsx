import { useEffect } from "react";
import { type Categories } from "../../api";
import { getSegmentPercentRange } from "../../utils";
import { CUSTOM_EVENTS } from "../../utils";
import type { StoredNoteData } from "../../types";
import { useNotes } from "../../hooks/useNotes";
import { withPrefix } from "../../utils";

// [🧱 REFACTOR]: temporary for now, redo categories
const misinformationColors: Record<Categories, string> = {
  FABRICATED_CONTENT: "#8E44AD",
  MANIPULATED_CONTENT: "#D35400",
  IMPOSTER_CONTENT: "#2980B9",
  MISLEADING_CONTENT: "#F39C12",
  FALSE_CONTEXT: "#16A085",
  SATIRE_AND_PARODY: "#95A5A6",
  FALSE_CONNECTIONS: "#2ECC71",
  SPONSORED_CONTENT: "#3498DB",
  PROPAGANDA: "#9B59B6",
  ERROR: "#BDC3C7",
};

// [🚀 FEATURE]: make displaying note segments dynamic, use notesMap as state
export default function NoteSegmentsList() {
  const { noteMap, setNoteMap, noteCacheInstance } = useNotes();

  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) {
      console.error("Could not locate video element");
      return;
    }

    noteCacheInstance.subscribe(setNoteMap);
    // const notesMap = buildNotesMap(getNotes().notes);
    const seenNotes = new Set<StoredNoteData>();
    //
    function handleTimeUpdate() {
      const currentPlayTime = Math.floor(video!.currentTime);
      const currentNote = noteMap.notesMap.get(currentPlayTime);
      if (currentNote !== undefined && !seenNotes.has(currentNote)) {
        dispatchShowNoteEvent(currentNote);
        // guarantees event is dispatched only once
        seenNotes.add(currentNote);
      }
    }
    // when seeking beyond an already seen note, remove it
    function handleUnSeeNote() {
      if (seenNotes.size) {
        const currentTime = Math.floor(video!.currentTime);
        seenNotes.forEach((note) => {
          if (currentTime <= note["endTime"]) seenNotes.delete(note);
        });
      }
    }
    video.addEventListener("seeked", handleUnSeeNote);
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("seeked", handleUnSeeNote);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  });
  const { videoLength, notesMap } = noteMap;
  return (
    <ul
      id={withPrefix("segments-list")}
      className={withPrefix("segments-list")}
    >
      {Array.from(notesMap.values()).map(
        ({ startTime, endTime, id, category }) => {
          const { segmentWidth, segmentLeftPos } = getSegmentPercentRange({
            ...{ videoLength, startTime, endTime },
          });
          return (
            <li
              className={withPrefix("segments-list__segment")}
              key={id}
              style={{
                width: segmentWidth,
                left: segmentLeftPos,
                background: `linear-gradient(to top, ${misinformationColors[category]} 40%, transparent 100%)`,
              }}
            ></li>
          );
        }
      )}
    </ul>
  );
}
// [⚙️ TECH DEBT]:  refactor all events into a centralized custom event handler
function dispatchShowNoteEvent(note: StoredNoteData) {
  const customEvent = new CustomEvent(CUSTOM_EVENTS.DISPLAY_NOTE, {
    detail: note,
  });
  window.dispatchEvent(customEvent);
}
