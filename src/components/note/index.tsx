import { useEffect, useRef, useState } from "react";
import type { BufferType } from "../note-queue-popup";
import type { StoredNoteData } from "../../types";
import {
  Linkify,
  NOTE_FORM_PLACEHOLDERS,
  removeNote,
  withPrefix,
} from "../../utils";

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
  const categoryColor = NOTE_FORM_PLACEHOLDERS.CATEGORIES[category]["color"];
  return (
    <div className={withPrefix("note__wrapper")}>
      <div className={withPrefix("note", expandable ? "note--expandable" : "")}>
        <div
          style={{
            backgroundColor: `rgb(from ${categoryColor} r g b / 10%)`,
          }}
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
            <p className={withPrefix("note__text")}>
              <Linkify text={noteContent} />
            </p>
          </div>
          <div className={withPrefix("note__action")}>
            <p>rate accuracy of this note</p>
            <button
              className={withPrefix(
                "form__rating-btn",
                "button",
                "button--primary",
                "button--sm"
              )}
            >
              <span className={withPrefix("button__text")}>Rate it</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        <form>
          <fieldset>
            <legend id={withPrefix("tablist-1")}>
              How Accurate was this note?
            </legend>
            <div role="tablist" aria-labelledby={withPrefix("tablist-1")}>
              {Object.keys(NOTE_FORM_PLACEHOLDERS.RATING).map((tabName, i) => {
                return (
                  <button
                    id={withPrefix(`tab-${tabName}`)}
                    className={withPrefix(
                      "form__rating-tab",
                      "button",
                      "button--primary",
                      "button--sm"
                    )}
                    type="button"
                    role="tab"
                    aria-selected={i === 0 ? true : false}
                    aria-controls={withPrefix(`tabpanel-${tabName}`)}
                    tabIndex={i === 0 ? 0 : -1}
                  >
                    <span className={withPrefix("button__text")}>
                      {tabName.toLowerCase()}
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              id={withPrefix(`tabpanel-${"ACCURATE"}`)}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={withPrefix(`tab-${"ACCURATE"}`)}
            >
              {NOTE_FORM_PLACEHOLDERS.RATING.ACCURATE.map(
                ({ name, displayName }) => {
                  return (
                    <label htmlFor={name}>
                      {displayName}
                      <input type="checkbox" name={name} id={name} />
                    </label>
                  );
                }
              )}
            </div>
            <div>
              <button>Submit</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
