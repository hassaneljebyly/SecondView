import { withPrefix } from "../../utils/class-names";
import type { Note as NoteType } from "../note-display";

// [🔒 ACCESSIBILITY]: add and improve accessibility
export default function Note({ note: noteData }: { note: NoteType | null }) {
  if (!noteData) {
    return;
  }
  const { category, note } = noteData;
  return (
    <div
      className={withPrefix("note")}
      style={{
        position: "absolute",
        bottom: "0",
        fontSize: "16px",
        padding: "1em",
        display: note ? "flex" : "none",
        flexDirection: "column",
        gap: "1em",
        maxWidth: "20ch",
        border: "1px solid black",
        borderRadius: "12px",
        marginBottom: "1em",
      }}
    >
      <div className={withPrefix("note__header")}>
        <h2 className={withPrefix("note__category")}>{category}</h2>
      </div>
      <div className={withPrefix("note__body")}>
        <div className={withPrefix("note__content")}>
          <p className={withPrefix("note__body")}>{note}</p>
        </div>
      </div>
    </div>
  );
}
