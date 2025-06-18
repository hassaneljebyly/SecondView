import { useEffect, useState } from "react";
import { withPrefix } from "../../utils/class-names";
import { getSegmentPercentRange } from "../../utils/timestamp";

type Note = {
  id: number;
  start: number;
  end: number;
  videoLength: number;
  category: string;
  note: string;
};
const exampleNotes: Note[] = [
  {
    id: 1,
    start: 0, // 0:45
    end: 60, // 1:00
    videoLength: 596,
    category: "ERROR",
    note: "The presenter states that penguins live in the Arctic, but penguins are actually found in the Antarctic and Southern Hemisphere. Polar bears live in the Arctic.",
  },
  {
    id: 2,
    start: 234, // 3:54
    end: 267, // 4:27
    videoLength: 596,
    category: "MISLEADING_CONTENT",
    note: "This statistic is from 2015 and is outdated. According to recent 2024 data from the same organization, this number has actually decreased by 40%.",
  },
  {
    id: 3,
    start: 445, // 7:25
    end: 490, // 8:10
    videoLength: 596,
    category: "FALSE_CONTEXT",
    note: "This quote is real but taken out of context. The speaker was referring to a hypothetical scenario, not making a factual claim about current events.",
  },
];

export default function NoteDisplay() {
  const [noteList, setNoteList] = useState(exampleNotes);
  useEffect(() => {
    const video = document.querySelector("video");
    let nextNoteIndex = 0;
    function handleTimeUpdate() {
      const current = Math.floor(video?.currentTime || 0);
      if (
        nextNoteIndex < exampleNotes.length &&
        current === exampleNotes[nextNoteIndex].end - 3
      ) {
        const displayNoteEvent = new CustomEvent("displayNote", {
          detail: noteList[nextNoteIndex],
        });
        window.dispatchEvent(displayNoteEvent);
        nextNoteIndex++;
      }
    }
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
    } else {
      console.log("no video element was found");
    }

    return () => video?.removeEventListener("timeupdate", handleTimeUpdate);
  }, [noteList]);
  return (
    <div id={withPrefix("note-display")}>
      <ul>
        {exampleNotes.map(({ id, videoLength, start, end }) => {
          const { segmentWidth, segmentLeftPos } = getSegmentPercentRange({
            ...{ videoLength, start, end },
          });
          return (
            <li
              key={id}
              style={
                {
                  "--width": segmentWidth,
                  "--left-pos": segmentLeftPos,
                } as React.CSSProperties
              }
            ></li>
          );
        })}
      </ul>
      <Note />
    </div>
  );
}

function Note() {
  const [note, setNote] = useState<Partial<Note>>({});

  useEffect(() => {
    let timeOut: ReturnType<typeof setTimeout>;

    function handleDisplayNoteEvent(e: Event) {
      const displayNoteEvent = e as CustomEvent<Note>;
      setNote(displayNoteEvent.detail);
      timeOut = setTimeout(() => {
        setNote({});
      }, 6000);
    }

    window.addEventListener("displayNote", handleDisplayNoteEvent);

    return () => {
      clearTimeout(timeOut);
      window.removeEventListener("displayNote", handleDisplayNoteEvent);
    };
  }, []);
  return (
    <div style={{ maxWidth: "30ch", translate: "0% -120%" }}>
      <div>{note.category}</div>
      <div>
        <p>{note.note}</p>
      </div>
    </div>
  );
}
