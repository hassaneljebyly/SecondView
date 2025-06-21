import { useEffect } from "react";
import { getNotes } from "../../api";
import { withPrefix } from "../../utils/class-names";
import { getSegmentPercentRange } from "../../utils/timestamp";
import { CUSTOM_EVENTS } from "../../utils/constant";

const segmentListStyles: React.CSSProperties = {
  listStyle: "none",
  padding: "0px",
  margin: "0px",
  position: "relative",
  translate: "13% 38vh",
  background: "red",
  height: "2px",
  width: "369px",
};

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
      const currentPlayTime = Math.floor(video!.currentTime);
      const currentNote = notesMap.get(currentPlayTime);
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
    <div id={withPrefix("note-display")}>
      <ul style={segmentListStyles}>
        {getNotes().notes.map(({ videoLength, start, end }) => {
          const { segmentWidth, segmentLeftPos } = getSegmentPercentRange({
            ...{ videoLength, start, end },
          });
          return (
            <li
              key={segmentLeftPos}
              style={{
                position: "absolute",
                width: segmentWidth,
                left: segmentLeftPos,
                height: "10px",
                bottom: 0,
                background:
                  "linear-gradient(to top, #00ff88c2 40%, transparent 100%)",
              }}
            ></li>
          );
        })}
      </ul>
    </div>
  );
}
// [⚙️ TECH DEBT]:  refactor all events into a centralized custom event handler
function dispatchShowNoteEvent(note: Note) {
  const customEvent = new CustomEvent(CUSTOM_EVENTS.DISPLAY_NOTE, {
    detail: note,
  });
  window.dispatchEvent(customEvent);
}

// template
//<div style="width: 100%;position: relative;"> //? root
//  <div> // ?component
//    <ul style="list-style: none;padding: 0;margin: 0;position: relative;">
//      <li style="position: absolute;width: 20%;height: 10px;bottom: 0;background: linear-gradient(to top, #00ff88c2 40%, transparent 100%);"></li>
//    </ul>
//  <div>
//</div>;
