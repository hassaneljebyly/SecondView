import { useEffect, useState } from "react";
import { withPrefix } from "../../utils/class-names";
import { CUSTOM_EVENTS } from "../../utils/constant";
import type { Note as NoteType } from "../note-display";
import Note from "../note";
// [🔒 ACCESSIBILITY]: add and improve accessibility
export default function NotePopup() {
  const [notesList, setNotesList] = useState<
    [NoteType | null, NoteType | null]
  >([null, null]);

  console.log(notesList);
  useEffect(() => {
    function handleNoteDisplay(e: Event) {
      const displayNoteEvent = e as CustomEvent<NoteType>;
      if (displayNoteEvent.type === CUSTOM_EVENTS.DISPLAY_NOTE) {
        setNotesList((prev) => {
          const [, bottom] = prev;
          if (bottom === null) {
            return [null, displayNoteEvent.detail];
          } else {
            return [
              displayNoteEvent.detail === bottom
                ? null
                : displayNoteEvent.detail,
              bottom,
            ];
          }
        });
      }
    }

    function handleClearNote(e: Event) {
      const clearNoteEvent = e as CustomEvent<NoteType["id"]>;
      setNotesList(([top, bottom]) => {
        return [
          top?.id === clearNoteEvent.detail ? null : top,
          bottom?.id === clearNoteEvent.detail ? null : bottom,
        ];
      });
    }

    function handleNoteOpened(e: Event) {
      const noteOpened = e as CustomEvent<NoteType["id"]>;
      setNotesList(([top, bottom]) => {
        if (noteOpened.detail === top?.id) {
          return [null, top];
        }
        return [top, bottom];
      });
    }

    window.addEventListener(CUSTOM_EVENTS.DISPLAY_NOTE, handleNoteDisplay);
    window.addEventListener(CUSTOM_EVENTS.NOTE_OPENED, handleNoteOpened);
    window.addEventListener(CUSTOM_EVENTS.CLEAR_NOTE, handleClearNote);

    return () => {
      window.removeEventListener(CUSTOM_EVENTS.DISPLAY_NOTE, handleNoteDisplay);
      window.removeEventListener(CUSTOM_EVENTS.NOTE_OPENED, handleNoteOpened);
      window.removeEventListener(CUSTOM_EVENTS.CLEAR_NOTE, handleClearNote);
    };
  });
  const rowCount = notesList.filter(Boolean).length;
  console.log(rowCount);
  return (
    <div
      id={withPrefix("note-popup")}
      style={{
        position: "absolute",
        bottom: "20%",
        zIndex: 999,
        translate: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateRows:
            rowCount === 2 ? "1fr 1fr" : rowCount === 1 ? "1fr 0fr" : "0fr 0fr",
          transition: "grid-template-rows 0.3s ease",
          gap: rowCount === 2 ? "1em" : "0",
        }}
      >
        <div style={{ alignSelf: "end" }}>
          {notesList[0] && <Note note={notesList[0]} collapsable={true} />}
        </div>
        <div style={{ alignSelf: "end" }}>
          {notesList[1] && <Note note={notesList[1]} collapsable={true} />}
        </div>
      </div>
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
