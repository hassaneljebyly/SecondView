// [🧱 REFACTOR]:  refactor for clarity use json or whatever
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
export const NOTE_FORM_PLACEHOLDERS = {
  CATEGORIES: {
    TEMPORAL_MISREPRESENTATION: {
      value: "TEMPORAL_MISREPRESENTATION",
      displayName: "Temporal Misrepresentation",
      description:
        "Video content where timing is misrepresented, such as old footage presented as current events or clips from different time periods combined misleadingly.",
      color: "#F1C40F",
    },
    UNSUBSTANTIATED_ADVICE: {
      value: "UNSUBSTANTIATED_ADVICE",
      displayName: "Unsubstantiated Advice",
      description:
        "Medical, legal, financial, or safety advice given in videos without proper credentials or evidence, particularly dangerous in health and wellness content.",
      color: "#E74C3C",
    },
    MANIPULATED_CONTENT: {
      value: "MANIPULATED_CONTENT",
      displayName: "Manipulated Content",
      description:
        "Genuine video or audio that has been edited or distorted, such as selective editing to change meaning, deepfakes, voice cloning, or misleading thumbnails and titles.",
      color: "#D35400",
    },
    FABRICATED_CONTENT: {
      value: "FABRICATED_CONTENT",
      displayName: "Fabricated Content",
      description:
        "Completely false video content, including staged events presented as real, fake interviews, or entirely synthetic footage created to deceive viewers.",
      color: "#8E44AD",
    },
    MISLEADING_CONTENT: {
      value: "MISLEADING_CONTENT",
      displayName: "Misleading Content",
      description:
        "Video content that presents opinions, speculation, or unverified claims as established facts, common in commentary and podcast-style content.",
      color: "#F39C12",
    },
    SATIRE_AND_PARODY: {
      value: "SATIRE_AND_PARODY",
      displayName: "Satire and Parody",
      description:
        "Humorous video content that could be mistaken for real news or information, including sketch comedy or satirical news shows without clear disclaimers.",
      color: "#95A5A6",
    },
    FALSE_CONNECTIONS: {
      value: "FALSE_CONNECTIONS",
      displayName: "False Connections",
      description:
        "When unrelated footage, images, or audio clips are used to support or illustrate claims they don't actually relate to.",
      color: "#E67E22",
    },
    SPONSORED_CONTENT: {
      value: "SPONSORED_CONTENT",
      displayName: "Sponsored Content",
      description:
        "Paid promotions, product placements, or sponsored segments disguised as genuine reviews or editorial content without proper disclosure.",
      color: "#3498DB",
    },
    IMPOSTER_CONTENT: {
      value: "IMPOSTER_CONTENT",
      displayName: "Imposter Content",
      description:
        "Videos impersonating genuine sources, such as fake news channels, deepfake videos of real people, or channels using established media branding without authorization.",
      color: "#2980B9",
    },
    FALSE_CONTEXT: {
      value: "FALSE_CONTEXT",
      displayName: "False Context",
      description:
        "Factually accurate footage or audio combined with false contextual information, such as old footage presented as recent events or real clips with misleading narration.",
      color: "#16A085",
    },
    PROPAGANDA: {
      value: "PROPAGANDA",
      displayName: "Propaganda",
      description:
        "Video content systematically designed to influence viewer attitudes, values, or political beliefs through biased presentation or selective information.",
      color: "#9B59B6",
    },
    ERROR: {
      value: "ERROR",
      displayName: "Error",
      description:
        "Mistakes made by established news channels, educational content creators, or other credible sources in their video reporting or explanations.",
      color: "#BDC3C7",
    },
  },
  TEXTAREA: "Explain what's incorrect or provide additional context...",
  CATEGORY_SELECT: "Select note category",
  RATING: {
    accurate: [
      {
        name: "high-quality-sources",
        displayName: "High quality sources",
      },
      {
        name: "specific-clear",
        displayName: "Specific & clear",
      },
      {
        name: "contextually-relevant",
        displayName: "Contextually relevant",
      },
      {
        name: "actionable-information",
        displayName: "Actionable information",
      },
      {
        name: "balanced-tone",
        displayName: "Balanced tone",
      },
      {
        name: "recent-current",
        displayName: "Recent & current",
      },
      {
        name: "expert-perspective",
        displayName: "Expert perspective",
      },
      {
        name: "comprehensive",
        displayName: "Comprehensive",
      },
    ],
    inaccurate: [
      {
        name: "poor-source-quality",
        displayName: "Poor source quality",
      },
      {
        name: "vague-unclear",
        displayName: "Vague or unclear",
      },
      {
        name: "off-topic",
        displayName: "Off topic",
      },
      {
        name: "opinion-based",
        displayName: "Opinion based",
      },
      {
        name: "outdated-sources",
        displayName: "Outdated sources",
      },
      {
        name: "biased-language",
        displayName: "Biased language",
      },
      {
        name: "incomplete",
        displayName: "Incomplete",
      },
      {
        name: "spam-irrelevant",
        displayName: "Spam/irrelevant",
      },
    ],
  },
} as const;

export const REGEX = {
  TIME_STAMP_PATTERN: "^(\\d{1,2})(:([0-5]?[0-9]))?(:([0-5]?[0-9]))?$",
  ACCEPTED_LINKS_FORMAT:
    /(\b(?:https?:\/\/)?(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}(?=\b|\/|:|\?|#)(?::\d{1,5})?(?:\/[a-zA-Z0-9\-._~%]*)*(?:\?[^#\s]*)?(?:#[^\s]*)?)/gm,
} as const;

export const CUSTOM_EVENTS = {
  TOGGLE_FORM: "toggleForm",
  CLOSE_FORM: "closeForm",
  DISPLAY_NOTE: "displayNote",
  CLEAR_NOTE: "clearNote",
  NOTE_OPENED: "noteOpened",
} as const;

export const SUCCESS_MESSAGE_DURATION = 1500;
export const PREFIX = "sv-" as const;
