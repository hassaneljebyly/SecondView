import { useEffect, useRef, useState } from "react";
import type { Note as NoteType } from "../note-display";
import { CUSTOM_EVENTS } from "../../utils/constant";
import { withPrefix } from "../../utils/class-names";

type NoteQueue = [NoteType | null, NoteType | null];

export default function NoteQueuePopUp() {
  const [noteQueue, setNoteQueue] = useState<NoteQueue>([null, null]);

  useEffect(() => {
    window.addEventListener(CUSTOM_EVENTS.DISPLAY_NOTE, (e: unknown) => {
      const note = (e as CustomEvent<NoteType>).detail;
      setNoteQueue(([topNote, bottomNote]) => {
        if (!bottomNote) {
          return [topNote, note];
        } else {
          return [note === bottomNote ? null : note, bottomNote];
        }
      });
    });
  }, [noteQueue]);
  const noteQueueLength = noteQueue.filter(Boolean).length;
  return (
    <ul
      style={{
        position: "absolute",
        bottom: "20%",
        zIndex: 999,
        translate: "12px",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows:
          noteQueueLength === 2
            ? "1fr 1fr"
            : noteQueueLength === 1
            ? "1fr 0fr"
            : "0fr 0fr",
        transition: "grid-template-rows 0.3s ease",
        gap: noteQueueLength === 2 ? "1em" : "0",
      }}
      aria-hidden={!noteQueueLength}
    >
      {noteQueue.map((note, index) =>
        note ? (
          <li style={{ alignSelf: "end" }} key={note.id}>
            <Note
              setNoteQueue={setNoteQueue}
              expandable={true}
              noteData={note}
            />
          </li>
        ) : (
          <li style={{ alignSelf: "end" }} key={index}></li>
        )
      )}
    </ul>
  );
}

type NoteOptions =
  | {
      noteData: NoteType;
      expandable: true;
      setNoteQueue: React.Dispatch<React.SetStateAction<NoteQueue>>;
    }
  | {
      noteData: NoteType;
      expandable: false;
      setNoteQueue?: never;
    };
// [🎨 UI/UX]: make expandable note keyboard accessible
function Note({
  noteData: { category, note, id },
  expandable,
  setNoteQueue,
}: NoteOptions) {
  const [expanded, setExpanded] = useState(false);
  const noteHeaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const noteHeader = noteHeaderRef.current;
    function dismissNote() {
      setNoteQueue!(([topNote, bottomNote]) => {
        return [
          topNote?.id === id ? null : topNote,
          bottomNote?.id === id ? null : bottomNote,
        ];
      });
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
          setExpanded(true);
          if (setNoteQueue) {
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
              if (setNoteQueue) {
                setNoteQueue(([topNote, bottomNote]) => {
                  return [
                    topNote?.id === id ? null : topNote,
                    bottomNote?.id === id ? null : bottomNote,
                  ];
                });
              }
            }}
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

// class TempBuffer {
//   constructor(buffer: null[]) {
//     this.buffer = [null, null]
//   }
// }
