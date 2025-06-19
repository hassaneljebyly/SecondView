import type { NOTE_FORM_PLACEHOLDERS } from "../utils/constant";
// TODO: update where this is used
type Category = (typeof NOTE_FORM_PLACEHOLDERS.CATEGORIES)[number];

const data = {
  videoId: "dQw4w9WgXcQ",
  notes: [
    {
      id: "note1",
      start: 0,
      end: 60,
      videoLength: 596,
      category: "MISLEADING_CONTENT",
      note: "The video claims a product cures all diseases, but there is no scientific evidence supporting this.",
      timestamp: 1718700000,
    },
    {
      id: "note2",
      start: 120,
      end: 150,
      videoLength: 596,
      category: "FABRICATED_CONTENT",
      note: "The footage presented here is digitally altered and does not reflect any real event.",
      timestamp: 1718700100,
    },
    {
      id: "note3",
      start: 160,
      end: 180,
      videoLength: 596,
      category: "SATIRE_AND_PARODY",
      note: "This segment is intended as satire and should not be interpreted as factual information.",
      timestamp: 1718700200,
    },
    {
      id: "note4",
      start: 200,
      end: 220,
      videoLength: 596,
      category: "PROPAGANDA",
      note: "The segment contains political messaging designed to influence public opinion without presenting balanced views.",
      timestamp: 1718700300,
    },
  ],
  totalCount: 4,
};

export type NoteResponse = {
  id: string;
  start: number;
  end: number;
  videoLength: number;
  category: Category;
  note: string;
  timestamp: number;
};

export type VideoNotesResponse = {
  videoId: string;
  notes: NoteResponse[];
  totalCount: number;
};

export function getNotes() {
  return data;
}
