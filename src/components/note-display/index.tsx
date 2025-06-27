import { useEffect } from "react";
import { getNotes } from "../../api";
import { withPrefix } from "../../utils/class-names";
import { getSegmentPercentRange } from "../../utils/timestamp";
import { CUSTOM_EVENTS } from "../../utils/constant";

// [🧱 REFACTOR]: temporary for now, redo categories
const misinformationColors = {
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
// [🧹 CLEANUP]: move to read me file
// | **Category**         | **Hex Color** | **Rationale**                                |
// | -------------------- | ------------- | -------------------------------------------- |
// | FABRICATED\_CONTENT  | `#8E44AD`     | Deep purple → serious deception              |
// | MANIPULATED\_CONTENT | `#D35400`     | Burnt orange → visual distortion             |
// | IMPOSTER\_CONTENT    | `#2980B9`     | Bold blue → impersonation/trust issues       |
// | MISLEADING\_CONTENT  | `#F39C12`     | Amber → partially true, but deceptive        |
// | FALSE\_CONTEXT       | `#16A085`     | Teal → contextually shifted, moderate risk   |
// | SATIRE\_AND\_PARODY  | `#95A5A6`     | Gray → low severity, humorous intent         |
// | FALSE\_CONNECTIONS   | `#2ECC71`     | Green → clickbait, but not fully false       |
// | SPONSORED\_CONTENT   | `#3498DB`     | Blue → commercial, less misleading intent    |
// | PROPAGANDA           | `#9B59B6`     | Violet → ideological, emotionally charged    |
// | ERROR                | `#BDC3C7`     | Light gray → neutral, unintentional mistakes |

export type Note = {
  id: string;
  start: number;
  end: number;
  videoLength: number;
  category: string;
  note: string;
  timestamp: number;
};

// This allows O(1) lookup on each timeupdate event instead of looping over all notes
// or using the old approach of nextNoteIndex which need the notes to be sorted based on end time
// also when user skips or seek forwards or backward there's no need to reset the nextNoteIndex
// also will make it easier to add optimistic UI later when a note is added, deleted or edited

function buildNotesMap(notes: Note[]): Map<number, Note> {
  const notesMap = new Map<number, Note>();
  notes.forEach((note) => {
    notesMap.set(note.end, note);
  });
  return notesMap;
}

export default function NoteDisplay() {
  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) {
      console.error("Could not locate video element");
      return;
    }
    const notesMap = buildNotesMap(getNotes().notes);
    const seenNotes = new Set<Note>();
    //
    function handleTimeUpdate() {
      const noteDisplayOffset = 3; // seconds
      const currentPlayTime = Math.floor(video!.currentTime);
      const currentNote = notesMap.get(currentPlayTime + noteDisplayOffset);
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
          if (currentTime <= note.end) seenNotes.delete(note);
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
  return (
    <ul id={withPrefix("note-display")} className={withPrefix("note-display")}>
      {getNotes().notes.map(({ videoLength, start, end, id, category }) => {
        const { segmentWidth, segmentLeftPos } = getSegmentPercentRange({
          ...{ videoLength, start, end },
        });
        return (
          <li
            // [🧹 CLEANUP]: rename to note segment list
            className={withPrefix("note-display__segment")}
            key={id}
            style={{
              width: segmentWidth,
              left: segmentLeftPos,
              // @ts-expect-error find a way to better type misinformationColors && NOTE_FORM_PLACEHOLDERS.CATEGORIES
              background: `linear-gradient(to top, ${misinformationColors[category]} 40%, transparent 100%)`,
            }}
          ></li>
        );
      })}
    </ul>
  );
}
// [⚙️ TECH DEBT]:  refactor all events into a centralized custom event handler
function dispatchShowNoteEvent(note: Note) {
  const customEvent = new CustomEvent(CUSTOM_EVENTS.DISPLAY_NOTE, {
    detail: note,
  });
  window.dispatchEvent(customEvent);
}
