import type { Root } from 'react-dom/client';

import { videoDetailsMap } from '../dom/youtube';
import { globalEventSingleton } from '../lib/events';

export function clearVideoDetailsMap() {
  videoDetailsMap.clear();
}
export function clearEvents() {
  globalEventSingleton.destroy();
}

export function cleanupMountedRoots(rootsMap: Map<string, Root>) {
  for (const [wrapperId, root] of rootsMap) {
    root.unmount();
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.remove();
    rootsMap.delete(wrapperId);
  }
}

export function cleanUp(cleanUpTasks: Array<() => void>) {
  cleanUpTasks.forEach(task => task());
}
