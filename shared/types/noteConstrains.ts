import type { NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';

export type NoteCategoryKeys = keyof typeof NOTE_CATEGORIES;
export type NoteCategoryKeysArray = NoteCategoryKeys[];
export type NoteCategoryValues = {
  displayName: string;
  description: string;
  color: string;
};

export type NoteMisInfoCategories = {
  [T in NoteCategoryKeys]: NoteCategoryValues;
};
