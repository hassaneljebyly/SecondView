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
