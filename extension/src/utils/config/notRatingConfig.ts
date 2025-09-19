import type { RatingsCheckboxesArray } from '@/types/noteRating';
import type { AccurateRatingValue, InaccurateRatingValue } from '@shared/types/noteRating';

export const ACCURATE_RATINGS_ARRAY: RatingsCheckboxesArray<AccurateRatingValue> = [
  {
    value: 'reliable-sources',
    label: 'Reliable Sources',
    description: 'high-quality, credible sources',
  },
  { value: 'well-documented', label: 'Well Documented', description: 'claims backed by evidence' },
  {
    value: 'contextually-relevant',
    label: 'Contextually Relevant',
    description: 'directly addresses the claim',
  },
  { value: 'clear-explanation', label: 'Clear Explanation', description: 'easy to understand' },
  { value: 'neutral-tone', label: 'Neutral Tone', description: 'objective, professional language' },
  {
    value: 'current-information',
    label: 'Current Information',
    description: 'up-to-date sources/facts',
  },
  {
    value: 'comprehensive-coverage',
    label: 'Comprehensive Coverage',
    description: 'addresses the full claim',
  },
  {
    value: 'actionable-helpful',
    label: 'Actionable Helpful',
    description: 'gives viewers useful info',
  },
];

export const INACCURATE_RATINGS_ARRAY: RatingsCheckboxesArray<InaccurateRatingValue> = [
  {
    value: 'unreliable-sources',
    label: 'Unreliable Sources',
    description: 'poor quality or biased sources',
  },
  { value: 'unsupported-claims', label: 'Unsupported Claims', description: 'no evidence provided' },
  { value: 'off-topic', label: 'Off Topic', description: "doesn't match the flagged content" },
  {
    value: 'confusing-unclear',
    label: 'Confusing Unclear',
    description: 'hard to follow or vague',
  },
  { value: 'biased-language', label: 'Biased Language', description: 'inflammatory or one-sided' },
  {
    value: 'outdated-information',
    label: 'Outdated Information',
    description: 'old or superseded info',
  },
  {
    value: 'incomplete-shallow',
    label: 'Incomplete Shallow',
    description: "doesn't fully address the issue",
  },
  { value: 'spam-unhelpful', label: 'Spam Unhelpful', description: 'low effort or irrelevant' },
];

export const RATINGS_CHECKBOXES_TABS = {
  accurate: ACCURATE_RATINGS_ARRAY,
  inaccurate: INACCURATE_RATINGS_ARRAY,
};
