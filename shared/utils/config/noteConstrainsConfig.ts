import type {
  MisinfoCategory,
  MisinfoType,
  MisinfoTypeValues,
  MisinfoTypeValuesArray,
} from '@shared/types/noteConstrains';

import { ACCEPTED_LINKS_FORMAT, TIME_STAMP_REGEX } from './regexConfig';

export const MIN_SEGMENT_LENGTH = 10;
export const MAX_SEGMENT_LENGTH = 180;
export const MIN_NOTE_LENGTH = 10;
export const MAX_NOTE_LENGTH = 500;

export const MISINFO_CATEGORIES: Record<MisinfoCategory, string> = {
  MEDIA_INTEGRITY: 'Media Integrity',
  INFORMATION_QUALITY: 'Information Quality',
  INFLUENCE_DISCLOSURE: 'Influence & Disclosure',
  SPECIAL_CASES: 'Special Cases',
} as const;

export const NOTE_CATEGORIES: MisinfoType[] = [
  // media integrity
  {
    value: 'MANIPULATED_CONTENT',
    displayName: 'Manipulated Content',
    category: 'MEDIA_INTEGRITY',
    description:
      'Real video or audio that has been edited or distorted to change its meaning — selective cuts, deepfakes, voice cloning, or misleading thumbnails.',
    notePlaceholder:
      'Describe what was altered and how it changes the meaning. Link to the original footage if available...',
  },
  {
    value: 'FABRICATED_CONTENT',
    displayName: 'Fabricated Content',
    category: 'MEDIA_INTEGRITY',
    description:
      'Entirely invented content — staged events presented as real, fake interviews, or synthetic footage created to deceive.',
    notePlaceholder:
      'Explain what was fabricated and provide sources showing this did not occur...',
  },
  {
    value: 'IMPOSTER_CONTENT',
    displayName: 'Imposter Content',
    category: 'MEDIA_INTEGRITY',
    description:
      'Content impersonating legitimate sources — fake news channels, unauthorized use of established media branding, or deepfakes of real people.',
    notePlaceholder:
      'Identify the real source being impersonated and explain how to tell the difference...',
  },
  {
    value: 'TEMPORAL_MISREPRESENTATION',
    displayName: 'Temporal Misrepresentation',
    category: 'MEDIA_INTEGRITY',
    description:
      'Old footage or past events deliberately presented as current, or clips from different time periods combined to mislead.',
    notePlaceholder:
      'Provide the actual date of this footage and a source confirming when it was originally recorded...',
  },
  {
    value: 'FALSE_CONNECTIONS',
    displayName: 'False Connections',
    category: 'MEDIA_INTEGRITY',
    description:
      'Unrelated footage, images, or audio used to illustrate claims they have no actual connection to.',
    notePlaceholder:
      'Explain what this footage actually shows and why it does not support the claim being made...',
  },

  // information quality
  {
    value: 'MISLEADING_CONTENT',
    displayName: 'Misleading Content',
    category: 'INFORMATION_QUALITY',
    description:
      'Opinions, speculation, or unverified claims framed as established facts — common in commentary, reaction, and podcast-style content.',
    notePlaceholder:
      'Clarify what is opinion vs fact here, and provide sources for what the evidence actually shows...',
  },
  {
    value: 'FALSE_CONTEXT',
    displayName: 'False Context',
    category: 'INFORMATION_QUALITY',
    description:
      'Accurate footage or audio paired with false surrounding information — real clips with wrong narration, or correct events described inaccurately.',
    notePlaceholder:
      'Describe what the footage actually shows and provide the correct context with sources...',
  },
  {
    value: 'MISSING_CONTEXT',
    displayName: 'Missing Context',
    category: 'INFORMATION_QUALITY',
    description:
      'Technically accurate content that omits relevant information, creating a false impression through incompleteness rather than falsehood.',
    notePlaceholder:
      'Add the missing context here. What does the viewer need to know to form an accurate picture?...',
  },
  {
    value: 'OUTDATED_INFORMATION',
    displayName: 'Outdated Information',
    category: 'INFORMATION_QUALITY',
    description:
      'Content that was accurate when published but has since been contradicted, updated, or clarified by new evidence or events.',
    notePlaceholder:
      'Explain what has changed since this was published and link to more recent sources...',
  },
  {
    value: 'ERROR',
    displayName: 'Error',
    category: 'INFORMATION_QUALITY',
    description:
      'Honest mistakes by otherwise credible creators — factual errors, incorrect statistics, or misidentified footage without apparent deceptive intent.',
    notePlaceholder:
      'Point out the specific error and provide a source with the correct information...',
  },

  // influence and disclosure
  {
    value: 'PROPAGANDA',
    displayName: 'Propaganda',
    category: 'INFLUENCE_DISCLOSURE',
    description:
      'Content systematically designed to influence beliefs or political attitudes through biased framing, selective information, or emotional manipulation.',
    notePlaceholder:
      'Describe the framing technique being used and provide a more balanced source on this topic...',
  },
  {
    value: 'SPONSORED_CONTENT',
    displayName: 'Undisclosed Sponsorship',
    category: 'INFLUENCE_DISCLOSURE',
    description:
      'Paid promotions or product placements presented as genuine reviews or editorial opinions without proper disclosure to viewers.',
    notePlaceholder:
      'Provide evidence of the undisclosed sponsorship relationship, such as brand deal disclosures found elsewhere...',
  },
  {
    value: 'UNSUBSTANTIATED_ADVICE',
    displayName: 'Unsubstantiated Advice',
    category: 'INFLUENCE_DISCLOSURE',
    description:
      'Medical, legal, financial, or safety advice given without credentials or evidence — particularly common in health, wellness, and finance content.',
    notePlaceholder:
      'Link to credentialed sources that contradict or add important nuance to this advice...',
  },

  // special cases
  {
    value: 'SATIRE_PARODY',
    displayName: 'Satire or Parody',
    category: 'SPECIAL_CASES',
    description:
      'Humorous or satirical content that could be mistaken for genuine reporting — sketch comedy, satirical news, or parody accounts without clear disclaimers.',
    notePlaceholder:
      'Clarify that this is satire and identify the real event or person being parodied if relevant...',
  },
] as const;

export const MISINFO_COLORS: Record<MisinfoTypeValues, string> = {
  MANIPULATED_CONTENT: '#E8443A',
  FABRICATED_CONTENT: '#C0392B',
  IMPOSTER_CONTENT: '#E91E8C',
  TEMPORAL_MISREPRESENTATION: '#FF7043',
  FALSE_CONNECTIONS: '#FF9800',

  MISLEADING_CONTENT: '#5C6BC0',
  FALSE_CONTEXT: '#3949AB',
  MISSING_CONTEXT: '#0097A7',
  OUTDATED_INFORMATION: '#00ACC1',
  ERROR: '#78909C',

  PROPAGANDA: '#7B1FA2',
  SPONSORED_CONTENT: '#AB47BC',
  UNSUBSTANTIATED_ADVICE: '#CE93D8',

  SATIRE_PARODY: '#90A4AE',
} as const;

export const NOTE_CATEGORIES_OPTIONS = NOTE_CATEGORIES.map(
  cat => cat.value
) as MisinfoTypeValuesArray;

export const validationConstants = {
  timeStampRegex: TIME_STAMP_REGEX,
  minSegmentLength: MIN_SEGMENT_LENGTH,
  maxSegmentLength: MAX_SEGMENT_LENGTH,
  maxNoteLength: MAX_NOTE_LENGTH,
  minNoteLength: MIN_NOTE_LENGTH,
  noteCategories: NOTE_CATEGORIES_OPTIONS,
  validLinksFormat: ACCEPTED_LINKS_FORMAT,
};
