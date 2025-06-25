import { useEffect, useRef, useState } from "react";
import { withPrefix } from "../../utils/class-names";
import type { Note as NoteType } from "../note-display";
import { CUSTOM_EVENTS } from "../../utils/constant";

// [🔒 ACCESSIBILITY]: add and improve accessibility
export default function Note({
  collapsable,
  note: noteData,
}: {
  note: NoteType | null;
  collapsable: boolean;
}) {
  // const [hideNote, setHideNote] = useState(false);
  const [expanded, setCollapse] = useState(false);
  const noteHeaderRef = useRef(null);
  function dispatchClearNoteEvent(
    e: AnimationEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (e instanceof MouseEvent) e.stopPropagation();
    const clearNotePopUpEvent = new CustomEvent(CUSTOM_EVENTS.CLEAR_NOTE, {
      detail: noteData?.id,
    });
    window.dispatchEvent(clearNotePopUpEvent);
  }
  useEffect(() => {
    const noteHeader = noteHeaderRef.current as HTMLDivElement | null;
    if (noteHeader) {
      noteHeader.addEventListener("animationend", dispatchClearNoteEvent);
    }
    return () =>
      noteHeader?.removeEventListener("animationend", dispatchClearNoteEvent);
  });
  if (!noteData) {
    return null;
  }
  const { category, note } = noteData;
  return (
    <div className={withPrefix("note")}>
      <div
        className={withPrefix("note__header")}
        role={collapsable ? "button" : "none"}
        tabIndex={collapsable ? 0 : -1}
        aria-label={category.replaceAll("_", " ").toLowerCase()}
        onClick={() => {
          setCollapse(!collapsable || !expanded);
          // [🛑 BLOCKER]:  clean all of this dispatch removing bottom note
          const event = new CustomEvent(CUSTOM_EVENTS.NOTE_OPENED, {
            detail: noteData.id,
          });
          window.dispatchEvent(event);
          setCollapse(true);
        }}
        aria-expanded={!collapsable || expanded}
        ref={noteHeaderRef}
      >
        <h2 className={withPrefix("note__category")}>
          {category.replaceAll("_", " ").toLowerCase()}
        </h2>
        {collapsable && (
          <button
            className={withPrefix("note__close")}
            aria-label="Close Note"
            type="button"
            onClick={dispatchClearNoteEvent}
          ></button>
        )}
      </div>
      <div className={withPrefix("note__body")}>
        <div className={withPrefix("note__content")}>
          <p className={withPrefix("note__text")}>{note}</p>
        </div>
      </div>
    </div>
  );
}
