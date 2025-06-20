import { useEffect, useState } from "react";
import { withPrefix } from "../../utils/class-names";
import { CUSTOM_EVENTS } from "../../utils/constant";
import type { Note as NoteType } from "../note-display";
import Note from "../note";
// TODO make it accessible
export default function NotePopup() {
  const [note, setNote] = useState<NoteType | null>(null);
  useEffect(() => {
    function handleNoteDisplay(e: Event) {
      const displayNoteEvent = e as CustomEvent<NoteType>;
      if (displayNoteEvent.type === CUSTOM_EVENTS.DISPLAY_NOTE) {
        setNote(displayNoteEvent.detail);
      }
    }

    let timeoutId: number;
    if (note) {
      console.log("note displayed");
      timeoutId = setTimeout(() => {
        setNote(null);
      }, 3000);
    }
    window.addEventListener(CUSTOM_EVENTS.DISPLAY_NOTE, handleNoteDisplay);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener(CUSTOM_EVENTS.DISPLAY_NOTE, handleNoteDisplay);
    };
  });
  return (
    <div id={withPrefix("note-popup")} style={{ position: "relative" }}>
      <Note note={note} />
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
