import { useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "../../utils";
import Note from "../note";
import type { StoredNoteData } from "../../types";
import { addNewNote, withPrefix } from "../../utils";

export type BufferType = [StoredNoteData | null, StoredNoteData | null];
export default function NoteQueuePopUp() {
  const [noteQueue, setNoteQueue] = useState<BufferType>([null, null]);

  useEffect(() => {
    function displayNoteHandler(e: unknown) {
      const note = (e as CustomEvent<StoredNoteData>).detail;
      setNoteQueue((prev) => addNewNote(note, prev));
    }
    window.addEventListener(CUSTOM_EVENTS.DISPLAY_NOTE, displayNoteHandler);
    return () =>
      window.removeEventListener(
        CUSTOM_EVENTS.DISPLAY_NOTE,
        displayNoteHandler
      );
  });
  const noteQueueLength = noteQueue.filter(Boolean).length;
  return (
    <ul className={withPrefix("note-buffer")} aria-hidden={!noteQueueLength}>
      {noteQueue.map((note, index) =>
        note ? (
          <li
            className={withPrefix("note-buffer__item")}
            style={{ alignSelf: "end" }}
            key={note.id}
          >
            <Note
              setNoteQueue={setNoteQueue}
              expandable={true}
              noteData={note}
            />
          </li>
        ) : (
          <li
            className={withPrefix("note-buffer__item")}
            // [🧹 CLEANUP]: probably not needed
            style={{ alignSelf: "end" }}
            key={index}
          ></li>
        )
      )}
    </ul>
  );
}
