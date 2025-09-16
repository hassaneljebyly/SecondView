import type { NoteCategoryKeysArray } from '@shared/types/noteConstrains';

import { ACCEPTED_LINKS_FORMAT, TIME_STAMP_REGEX } from './regexConfig';

export const MIN_SEGMENT_LENGTH = 10;
export const MAX_SEGMENT_LENGTH = 180;
export const MIN_NOTE_LENGTH = 10;
export const MAX_NOTE_LENGTH = 500;

export const NOTE_CATEGORIES = {
  TEMPORAL_MISREPRESENTATION: {
    displayName: 'Temporal Misrepresentation',
    description:
      'Video content where timing is misrepresented, such as old footage presented as current events or clips from different time periods combined misleadingly.',
    color: '#F1C40F',
  },
  UNSUBSTANTIATED_ADVICE: {
    displayName: 'Unsubstantiated Advice',
    description:
      'Medical, legal, financial, or safety advice given in videos without proper credentials or evidence, particularly dangerous in health and wellness content.',
    color: '#E74C3C',
  },
  MANIPULATED_CONTENT: {
    displayName: 'Manipulated Content',
    description:
      'Genuine video or audio that has been edited or distorted, such as selective editing to change meaning, deepfakes, voice cloning, or misleading thumbnails and titles.',
    color: '#D35400',
  },
  FABRICATED_CONTENT: {
    displayName: 'Fabricated Content',
    description:
      'Completely false video content, including staged events presented as real, fake interviews, or entirely synthetic footage created to deceive viewers.',
    color: '#8E44AD',
  },
  MISLEADING_CONTENT: {
    displayName: 'Misleading Content',
    description:
      'Video content that presents opinions, speculation, or unverified claims as established facts, common in commentary and podcast-style content.',
    color: '#F39C12',
  },
  SATIRE_AND_PARODY: {
    displayName: 'Satire and Parody',
    description:
      'Humorous video content that could be mistaken for real news or information, including sketch comedy or satirical news shows without clear disclaimers.',
    color: '#95A5A6',
  },
  FALSE_CONNECTIONS: {
    displayName: 'False Connections',
    description:
      "When unrelated footage, images, or audio clips are used to support or illustrate claims they don't actually relate to.",
    color: '#E67E22',
  },
  SPONSORED_CONTENT: {
    displayName: 'Sponsored Content',
    description:
      'Paid promotions, product placements, or sponsored segments disguised as genuine reviews or editorial content without proper disclosure.',
    color: '#3498DB',
  },
  IMPOSTER_CONTENT: {
    displayName: 'Imposter Content',
    description:
      'Videos impersonating genuine sources, such as fake news channels, deepfake videos of real people, or channels using established media branding without authorization.',
    color: '#2980B9',
  },
  FALSE_CONTEXT: {
    displayName: 'False Context',
    description:
      'Factually accurate footage or audio combined with false contextual information, such as old footage presented as recent events or real clips with misleading narration.',
    color: '#16A085',
  },
  PROPAGANDA: {
    displayName: 'Propaganda',
    description:
      'Video content systematically designed to influence viewer attitudes, values, or political beliefs through biased presentation or selective information.',
    color: '#9B59B6',
  },
  ERROR: {
    displayName: 'Error',
    description:
      'Mistakes made by established news channels, educational content creators, or other credible sources in their video reporting or explanations.',
    color: '#BDC3C7',
  },
};

export const NOTE_CATEGORIES_OPTIONS = Object.keys(NOTE_CATEGORIES) as NoteCategoryKeysArray;

export const validationConstants = {
  timeStampRegex: TIME_STAMP_REGEX,
  minSegmentLength: MIN_SEGMENT_LENGTH,
  maxSegmentLength: MAX_SEGMENT_LENGTH,
  maxNoteLength: MAX_NOTE_LENGTH,
  minNoteLength: MIN_NOTE_LENGTH,
  noteCategories: NOTE_CATEGORIES_OPTIONS,
  validLinksFormat: ACCEPTED_LINKS_FORMAT,
};
