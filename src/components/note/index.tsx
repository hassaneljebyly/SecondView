import { useState } from "react";
import { withPrefix } from "../../utils/class-names";
import type { Note as NoteType } from "../note-display";

// [🔒 ACCESSIBILITY]: add and improve accessibility
export default function Note({
  collapsable,
  note: noteData,
}: {
  note: NoteType | null;
  collapsable: boolean;
}) {
  const [hideNote, setHideNote] = useState(false);
  const [expanded, setCollapse] = useState(false);
  if (!noteData) {
    return null;
  }
  const { category, note } = noteData;
  return (
    <div
      className={withPrefix("note")}
      style={{ visibility: hideNote ? "hidden" : "visible" }}
    >
      <div
        className={withPrefix("note__header")}
        role={collapsable ? "button" : "none"}
        tabIndex={collapsable ? 0 : -1}
        aria-label={category.replaceAll("_", " ").toLowerCase()}
        onClick={() => setCollapse(!collapsable || !expanded)}
        aria-expanded={!collapsable || expanded}
      >
        <h2 className={withPrefix("note__category")}>
          {category.replaceAll("_", " ").toLowerCase()}
        </h2>
        {collapsable && (
          <button
            className={withPrefix("note__close")}
            aria-label="Close Note"
            type="button"
            onClick={() => setHideNote(true)}
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
