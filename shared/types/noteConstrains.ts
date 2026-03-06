export type MisinfoTypeValues =
  | 'MANIPULATED_CONTENT'
  | 'FABRICATED_CONTENT'
  | 'IMPOSTER_CONTENT'
  | 'TEMPORAL_MISREPRESENTATION'
  | 'FALSE_CONNECTIONS'
  | 'MISLEADING_CONTENT'
  | 'FALSE_CONTEXT'
  | 'MISSING_CONTEXT'
  | 'OUTDATED_INFORMATION'
  | 'ERROR'
  | 'PROPAGANDA'
  | 'SPONSORED_CONTENT'
  | 'UNSUBSTANTIATED_ADVICE'
  | 'SATIRE_PARODY';

export type MisinfoCategory =
  | 'MEDIA_INTEGRITY'
  | 'INFORMATION_QUALITY'
  | 'INFLUENCE_DISCLOSURE'
  | 'SPECIAL_CASES';

export type MisinfoTypeValuesArray = MisinfoTypeValues[];

export type MisinfoType = {
  value: MisinfoTypeValues;
  displayName: string;
  category: MisinfoCategory;
  description: string;
  notePlaceholder: string;
};
