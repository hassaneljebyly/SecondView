import type { GetNotesResponse } from "../types";
import type { NOTE_FORM_PLACEHOLDERS } from "../utils/constant";

export type Categories = (typeof NOTE_FORM_PLACEHOLDERS.CATEGORIES)[number];

const localTestData: GetNotesResponse = {
  videoId: "dQw4w9WgXcQ",
  notes: [
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note1",
      startTime: 0,
      endTime: 60,
      category: "MISLEADING_CONTENT",
      noteContent:
        "The video claims a product cures all diseases, but there is no scientific evidence supporting this.",
    },
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note2",
      startTime: 120,
      endTime: 150,
      category: "FABRICATED_CONTENT",
      noteContent:
        "The footage presented here is digitally altered and does not reflect any real event.",
    },
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note3",
      startTime: 160,
      endTime: 180,
      category: "SATIRE_AND_PARODY",
      noteContent:
        "This segment is intended as satire and should not be interpreted as factual information.",
    },
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note4",
      startTime: 200,
      endTime: 220,
      category: "PROPAGANDA",
      noteContent:
        "The segment contains political messaging designed to influence public opinion without presenting balanced views.",
    },
  ],
  videoLength: 596,
};

const youtubeTestData: GetNotesResponse = {
  videoId: "iranAttackUSBase123",
  notes: [
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note1",
      startTime: 10,
      endTime: 120,
      category: "FABRICATED_CONTENT",
      noteContent:
        "The footage shown is actually from a 2019 explosion in Beirut and not related to any recent incident involving Iran or a US base.",
    },
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note2",
      startTime: 150,
      endTime: 240,
      category: "MISLEADING_CONTENT",
      noteContent:
        "The video implies that a full-scale war has begun, but official sources confirm no military escalation has occurred.",
    },
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note3",
      startTime: 300,
      endTime: 320,
      category: "SATIRE_AND_PARODY",
      noteContent:
        "This segment uses overlaid audio and edited visuals for comedic effect, not actual reporting.",
    },
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note4",
      startTime: 450,
      endTime: 490,
      category: "PROPAGANDA",
      noteContent:
        "This portion features commentary that heavily favors one side and omits key facts from the opposing perspective.",
    },
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note5",
      startTime: 600,
      endTime: 640,
      category: "FALSE_CONTEXT",
      noteContent:
        "Claims about casualties and damage are not backed by any verifiable sources as of the time of publication.",
    },
    {
      createdAt: 41112121231,
      submittedBy: "jsjdlskdlskdd",
      id: "note6",
      startTime: 1115,
      endTime: 1355,
      category: "IMPOSTER_CONTENT",
      noteContent:
        "Claims about casualties and damage are not backed by any verifiable sources as of the time of publication.",
    },
  ],
  videoLength: 1355,
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

export function getNotes(): GetNotesResponse {
  return window.location.pathname === "/watch"
    ? youtubeTestData
    : localTestData;
}
