import type { Root } from 'react-dom/client';

import { videoDetailsMap } from '../dom/youtube';
import { globalEventSingleton } from '../lib/events';

export const ROOTS = new Map<string, Root>();
export function cleanUp(rootsMap: Map<string, Root>) {
  videoDetailsMap.clear();
  globalEventSingleton.destroy();
  for (const [wrapperId, root] of rootsMap) {
    root.unmount();
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.remove();
    rootsMap.delete(wrapperId);
  }
}
