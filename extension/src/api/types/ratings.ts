import type { ApiResponse } from './responses';

export type AccurateRatingValue =
  | 'reliable-sources' // high-quality, credible sources
  | 'well-documented' // claims backed by evidence
  | 'contextually-relevant' // directly addresses the claim
  | 'clear-explanation' // easy to understand
  | 'neutral-tone' // objective, professional language
  | 'current-information' // up-to-date sources/facts
  | 'comprehensive-coverage' // addresses the full claim
  | 'actionable-helpful'; // gives viewers useful info

export type InaccurateRatingValue =
  | 'unreliable-sources' // poor quality or biased sources
  | 'unsupported-claims' // no evidence provided
  | 'off-topic' // doesn't match the flagged content
  | 'confusing-unclear' // hard to follow or vague
  | 'biased-language' // inflammatory or one-sided
  | 'outdated-information' // old or superseded info
  | 'incomplete-shallow' // doesn't fully address the issue
  | 'spam-unhelpful'; // low effort or irrelevant

export type RatingData = {
  vote: 'accurate' | 'inaccurate';
  reasons: (AccurateRatingValue | InaccurateRatingValue)[];
};

export type RatingSubmissionPayload = {
  noteData: { noteId: string };
  ratingData: RatingData;
};

export type NoteAccuracyBreakDown = {
  accuracyScore: number;
  confidenceScore: number;
  maxPossibleScore: number;
  rawScore: number;
};

export type EvaluatedResponse = {
  status: 'EVALUATED';
  votes: number;
  minRequiredVotesForConsensus?: never;
  accuracyBreakdown: NoteAccuracyBreakDown;
};
export type NeedsMoreVotesResponse = {
  status: 'NEEDS_MORE_VOTES';
  votes: number | null;
  accuracyBreakdown: null;
  minRequiredVotesForConsensus: number;
};
export type NoteAccuracyResponse = NeedsMoreVotesResponse | EvaluatedResponse;

export type SubmitNoteRatingResponse = ApiResponse<NoteAccuracyResponse>;
