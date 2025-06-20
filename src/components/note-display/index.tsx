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

export default function NoteDisplay() {
  useEffect(() => {
    const video = document.querySelector("video");
    if (!video) {
      console.error("Could not locate video element");
      return;
    }
    // NOTE must be sorted nextNoteIndex assumes It's sorted
    const notesList = getNotes().notes;
    let nextNoteIndex = 0;
    //
    function handleTimeUpdate() {
      if (nextNoteIndex >= notesList.length) {
        video!.removeEventListener("timeupdate", handleTimeUpdate);
        return;
      }
      const nextNote = notesList[nextNoteIndex];
      const currentPlayTime = Math.floor(video!.currentTime);
      if (currentPlayTime === nextNote.end - 3) {
        dispatchShowNoteEvent(nextNote);
        nextNoteIndex++;
      }
    }
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video!.removeEventListener("timeupdate", handleTimeUpdate);
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
