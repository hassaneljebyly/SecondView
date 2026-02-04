import type { Expand, Spread } from './helpers';
import type { Note, VideoMetaData } from './notes';
import type { RatingSubmissionPayload } from './ratings';

export type CanonicalFields = {
  'submit-note': Expand<Spread<Note, VideoMetaData>>;
  'submit-rating': Expand<
    Spread<RatingSubmissionPayload['noteData'], RatingSubmissionPayload['ratingData']>
  >;
};
