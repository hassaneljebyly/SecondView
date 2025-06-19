import { useEffect } from "react";
import { getNotes } from "../../api";
import { withPrefix } from "../../utils/class-names";
import { getSegmentPercentRange } from "../../utils/timestamp";

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

export default function NoteDisplay() {
  useEffect(() => {
    const notesList = getNotes().notes;
    let nextNoteIndex = 0;
    //
    const video = document.querySelector("video");
    if (video) {
      video.addEventListener("timeupdate", () => {
        const nextNote = notesList[nextNoteIndex];
        const currentPlayTime = Math.floor(video.currentTime);
        if (
          currentPlayTime === nextNote.end - 3 &&
          nextNoteIndex < notesList.length
        ) {
          console.log(nextNote);
          nextNoteIndex++;
        }
      });
    } else {
      console.error("Could not locate video element");
    }
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

// template
//<div style="width: 100%;position: relative;"> //? root
//  <div> // ?component
//    <ul style="list-style: none;padding: 0;margin: 0;position: relative;">
//      <li style="position: absolute;width: 20%;height: 10px;bottom: 0;background: linear-gradient(to top, #00ff88c2 40%, transparent 100%);"></li>
//    </ul>
//  <div>
//</div>;
