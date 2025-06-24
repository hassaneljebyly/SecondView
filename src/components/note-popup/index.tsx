import { useEffect, useState } from "react";
import { withPrefix } from "../../utils/class-names";
import { CUSTOM_EVENTS } from "../../utils/constant";
import type { Note as NoteType } from "../note-display";
import Note from "../note";
import { getNotes } from "../../api";
// [🔒 ACCESSIBILITY]: add and improve accessibility
export default function NotePopup() {
  console.log("note container rendered");
  const [note, setNote] = useState<NoteType | null>(getNotes().notes[0]);
  useEffect(() => {
    // let timeoutId: ReturnType<typeof setTimeout>;
    function handleNoteDisplay(e: Event) {
      const displayNoteEvent = e as CustomEvent<NoteType>;
      if (displayNoteEvent.type === CUSTOM_EVENTS.DISPLAY_NOTE) {
        console.log("note displayed");
        setNote(displayNoteEvent.detail);
      }
    }
    // if (note) {
    //   timeoutId = setTimeout(() => {
    //     console.log("note removed");
    //     setNote(null);
    //   }, 8000);
    // }
    window.addEventListener(CUSTOM_EVENTS.DISPLAY_NOTE, handleNoteDisplay);

    return () => {
      // if (!isNaN(timeoutId)) clearTimeout(timeoutId);
      window.removeEventListener(CUSTOM_EVENTS.DISPLAY_NOTE, handleNoteDisplay);
    };
  });

  return (
    <div
      id={withPrefix("note-popup")}
      style={{
        position: "absolute",
        bottom: "20%",
        zIndex: 999,
        translate: "12px",
      }}
    >
      <Note note={note} collapsable={true} />
    </div>
  );
}

//
// template
// <div id="sv-note-popup">
//   <p
//     style="
//        position: absolute;
//        padding: 2em;
//        background: #f8f8f8;
//        border: 1px solid greenyellow;
//        font-size: 1.5rem;
//        z-index: 999;
//        bottom: 10%;
//        left: calc(12px + 0%);
//        color: black;
//        pointer-events: all;
//        box-sizing: border-box;">
//     Random Text Here
//   </p>
// </div>;
