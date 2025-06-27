// TODO: refactor for clarity
export const SEGMENT_LIMITS = {
  MIN_SECONDS: 10,
  MAX_SECONDS: 180,
} as const;

export const TIME_STAMP_MAX_LENGTH = 8;
export const MAX_ATTEMPTS = 5;

export const NOTE_LIMITS = {
  MAX_LENGTH: 500,
  MIN_LENGTH: 10,
} as const;
// [🧠 IDEA]:  revise these categories, check whatsapp last text
export const NOTE_FORM_PLACEHOLDERS = {
  CATEGORIES: [
    "FABRICATED_CONTENT",
    "MANIPULATED_CONTENT",
    "IMPOSTER_CONTENT",
    "MISLEADING_CONTENT",
    "FALSE_CONTEXT",
    "SATIRE_AND_PARODY",
    "FALSE_CONNECTIONS",
    "SPONSORED_CONTENT",
    "PROPAGANDA",
    "ERROR",
  ],
  TEXTAREA: "Explain what's incorrect or provide additional context...",
  CATEGORY_SELECT: "Select note category",
} as const;

export const REGEX = {
  TIME_STAMP_PATTERN: "^(\\d{1,2})(:([0-5]?[0-9]))?(:([0-5]?[0-9]))?$",
} as const;

export const CUSTOM_EVENTS = {
  // [🧹 CLEANUP]: unused, remove later
  TOGGLE_NOTE_FORM: "toggleNoteForm",
  // [🧹 CLEANUP]:  unused, remove later
  CLOSE_NOTE_FORM: "closeNoteForm",
  TOGGLE_FORM: "toggleForm",
  CLOSE_FORM: "closeForm",
  DISPLAY_NOTE: "displayNote",
  CLEAR_NOTE: "clearNote",
  NOTE_OPENED: "noteOpened",
} as const;

export const SUCCESS_MESSAGE_DURATION = 1500;
export const PREFIX = "sv-" as const;
