import type { CUSTOM_EVENTS } from '@/utils/config/customEventsConfig';

export type CustomEventMap = (typeof CUSTOM_EVENTS)[number];

export type GlobalEventNames = keyof WindowEventMap | CustomEventMap;
