import { useEffect, useRef, useState } from "react";
import type { BufferType } from "../note-queue-popup";
import type { StoredNoteData } from "../../types";
import { removeNote, withPrefix } from "../../utils";

type NoteOptions =
  | {
      noteData: StoredNoteData;
      expandable: true;
      setNoteQueue: React.Dispatch<React.SetStateAction<BufferType>>;
    }
  | {
      noteData: StoredNoteData;
      expandable: false;
      setNoteQueue?: never;
    };
// [🎨 UI/UX]: make expandable note keyboard accessible
export default function Note({
  noteData: { category, noteContent, id },
  expandable,
  setNoteQueue,
}: NoteOptions) {
  const [expanded, setExpanded] = useState(false);
  const noteHeaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const noteHeader = noteHeaderRef.current;
    function dismissNote() {
      setNoteQueue!((prev) => removeNote(id, prev));
    }
    if (noteHeader && expandable) {
      // only runs if note has expandable = true
      noteHeader.addEventListener("animationend", dismissNote);
    }
    return () => {
      noteHeader?.removeEventListener("animationend", dismissNote);
    };
  }, [expandable, id, setNoteQueue]);
  return (
    <div className={withPrefix("note", expandable ? "note--expandable" : "")}>
      <div
        className={withPrefix("note__header")}
        role={expandable ? "button" : "none"}
        aria-expanded={!expandable || expanded}
        ref={noteHeaderRef}
        onClick={() => {
          if (!expanded) setExpanded(true);
          // remove bottom note in buffer if user interacts with top note in buffer
          if (setNoteQueue && !expanded) {
            setNoteQueue(([topNote, bottomNote]) => {
              if (topNote) {
                return [null, topNote];
              }
              return [topNote, bottomNote];
            });
          }
        }}
      >
        <h2 className={withPrefix("note__category")}>
          {category.replaceAll("_", " ").toLowerCase()}
        </h2>

        {expandable && (
          <button
            className={withPrefix("note__close")}
            aria-label="Close Note"
            type="button"
            onClick={() => {
              if (setNoteQueue) setNoteQueue((prev) => removeNote(id, prev));
            }}
          ></button>
        )}
      </div>
      <div className={withPrefix("note__body")}>
        <div className={withPrefix("note__content")}>
          <p className={withPrefix("note__text")}>{noteContent}</p>
        </div>
      </div>
    </div>
  );
}
