import { useEffect, useRef, useState } from "react";
import type { BufferType } from "../note-queue-popup";
import type { StoredNoteData } from "../../types";
import {
  Linkify,
  NOTE_FORM_PLACEHOLDERS,
  removeNote,
  withPrefix,
} from "../../utils";
import NoteRating from "../note-rating";

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
  const [wrapperDimensions, setWrapperDimensions] = useState({});
  const [activePanel, setActivePanel] = useState<HTMLDivElement | null>(null);
  const [openRatingPanel, setOpenRatingPanel] = useState(false);
  const noteHeaderRef = useRef<HTMLDivElement | null>(null);
  const rateItButtonRef = useRef<HTMLButtonElement | null>(null);
  const defaultTabButtonRef = useRef<HTMLButtonElement | null>(null);
  const noteRatingPanelRef = useRef<HTMLDivElement | null>(null);
  const notePanelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (activePanel) {
      setWrapperDimensions({
        "--height": `${activePanel.offsetHeight}px`,
        "--width": `${activePanel.offsetWidth}px`,
      });
    }
  }, [activePanel]);
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
    <div
      className={withPrefix("note__wrapper")}
      style={{ ...wrapperDimensions }}
    >
      <div
        className={withPrefix("note", expandable ? "note--expandable" : "")}
        aria-hidden={openRatingPanel}
        ref={notePanelRef}
        /**
         * I had some issues where clicking Tab to move away from the note popup panel
         * would move the two tab panels out of view without changing state which made the disappear
         * this inert attribute solves that issue
         * inert prevents an element and all of its flat tree descendants from getting focus or click
         * applied when a tab panel is hidden
         */
        inert={openRatingPanel}
      >
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
              ref={rateItButtonRef}
              onClick={(e) => {
                /* e.currentTarget.blur() solves: 
                Blocked aria-hidden on an element because its descendant retained focus. 
                The focus must not be hidden from assistive technology users
                */
                e.currentTarget.blur();
                requestAnimationFrame(() => {
                  // focus default tab
                  defaultTabButtonRef.current?.focus({ preventScroll: true });
                });
                setActivePanel(noteRatingPanelRef.current);
                setOpenRatingPanel(true);
              }}
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
      <NoteRating
        defaultTabButtonRef={defaultTabButtonRef}
        rateItButtonRef={rateItButtonRef}
        notePanelRef={notePanelRef}
        ref={noteRatingPanelRef}
        setActivePanel={setActivePanel}
        openRatingPanel={openRatingPanel}
        setOpenRatingPanel={setOpenRatingPanel}
      />
    </div>
  );
}
