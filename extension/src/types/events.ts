import type { CUSTOM_EVENTS } from '@/utils/config/customEventsConfig';
import type { DeepNullable } from '@shared/types/helpers';

import type { StoreModels } from './storage';

export type CustomEventMap = (typeof CUSTOM_EVENTS)[number];

export type GlobalEventNames = keyof WindowEventMap | CustomEventMap;

export type StorageChangeEvent<Key extends keyof StoreModels> = {
  key: Key;
  oldValue: DeepNullable<StoreModels[Key]>;
  newValue: DeepNullable<StoreModels[Key]>;
};
