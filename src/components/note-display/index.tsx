import { getNotes } from "../../api";
import { withPrefix } from "../../utils/class-names";

const segmentListStyles: React.CSSProperties = {
  listStyle: "none",
  padding: "0px",
  margin: "0px",
  position: "relative",
  translate: "13% 38vh",
  background: "red",
  height: "2px",
  width: "369p",
};

export default function NoteDisplay() {
  return (
    <div id={withPrefix("note-display")}>
      <ul style={segmentListStyles}>
        {getNotes().notes.map((note) => {
          const widthPercent = (
            ((note.end - note.start) * 100) /
            note.videoLength
          ).toFixed(2);
          const leftPositionPercent = (
            (note.start * 100) /
            note.videoLength
          ).toFixed(2);
          return (
            <li
              style={{
                position: "absolute",
                width: `${widthPercent}%`,
                left: `${leftPositionPercent}%`,
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
