import type { RATINGS_CHECKBOXES_TABS } from '@/utils/config/notRatingConfig';
import type { AccurateRatingValue, InaccurateRatingValue } from '@shared/types/noteRating';

export type RatingsCheckboxesArray<T> = { value: T; label: string; description: string }[];
export type RatingTabsType = keyof typeof RATINGS_CHECKBOXES_TABS;

export type InaccurateRatingFlags = Partial<Record<InaccurateRatingValue, boolean>>;
export type AccurateRatingFlags = Partial<Record<AccurateRatingValue, boolean>>;
export type RatingFlagsState = {
  accurate: AccurateRatingFlags;
  inaccurate: InaccurateRatingFlags;
};
