import type { NOTE_FORM_PLACEHOLDERS } from "../utils/constant";

export type Categories = (typeof NOTE_FORM_PLACEHOLDERS.CATEGORIES)[number];

const localTestData: VideoNotesResponse = {
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

const youtubeTestData: VideoNotesResponse = {
  videoId: "iranAttackUSBase123",
  notes: [
    {
      id: "note1",
      start: 10,
      end: 120,
      videoLength: 1355,
      category: "FABRICATED_CONTENT",
      note: "The footage shown is actually from a 2019 explosion in Beirut and not related to any recent incident involving Iran or a US base.",
      timestamp: 1718800000,
    },
    {
      id: "note2",
      start: 150,
      end: 240,
      videoLength: 1355,
      category: "MISLEADING_CONTENT",
      note: "The video implies that a full-scale war has begun, but official sources confirm no military escalation has occurred.",
      timestamp: 1718800100,
    },
    {
      id: "note3",
      start: 300,
      end: 320,
      videoLength: 1355,
      category: "SATIRE_AND_PARODY",
      note: "This segment uses overlaid audio and edited visuals for comedic effect, not actual reporting.",
      timestamp: 1718800200,
    },
    {
      id: "note4",
      start: 450,
      end: 490,
      videoLength: 1355,
      category: "PROPAGANDA",
      note: "This portion features commentary that heavily favors one side and omits key facts from the opposing perspective.",
      timestamp: 1718800300,
    },
    {
      id: "note5",
      start: 600,
      end: 640,
      videoLength: 1355,
      category: "FALSE_CONTEXT",
      note: "Claims about casualties and damage are not backed by any verifiable sources as of the time of publication.",
      timestamp: 1718800400,
    },
    {
      id: "note6",
      start: 1115,
      end: 1355,
      videoLength: 1355,
      category: "IMPOSTER_CONTENT",
      note: "Claims about casualties and damage are not backed by any verifiable sources as of the time of publication.",
      timestamp: 1718800400,
    },
  ],
  totalCount: 5,
};

export type NoteResponse = {
  id: string;
  start: number;
  end: number;
  videoLength: number;
  category: Categories;
  note: string;
  timestamp: number;
};

export type VideoNotesResponse = {
  videoId: string;
  notes: NoteResponse[];
  totalCount: number;
};

export function getNotes(): VideoNotesResponse {
  return window.location.pathname === "/watch"
    ? youtubeTestData
    : localTestData;
}
