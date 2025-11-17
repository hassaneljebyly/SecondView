import type { Retries } from '@/types';
import { MOUNTED_ROOTS } from '@/utils/config/componentInjectConfig';
import { INJECT_TASK } from '@/utils/config/injectTasksConfig';
import { IS_DEV } from '@/utils/config/loggerConfig';
import { logger } from '@/utils/lib/logger';
import {
  cleanUp,
  cleanupMountedRoots,
  clearEvents,
  clearVideoDetailsMap,
} from '@/utils/scripts/cleanup';
import injectComponent from '@/utils/scripts/injectComponent';
import '@/styles/content/index.scss';
// uncomment css for popup for future test
// import '@/styles/popup/index.scss';

// console.log("remove import '@/styles/popup/index.scss';");

let pageId = Date.now();

let queuedTasks: Retries[] = INJECT_TASK.map(task => ({
  task,
  attempts: 0,
}));

function init() {
  const currentPageId = pageId;
  const retries: Retries[] = [];

  if (!(IS_DEV || window.location.pathname.startsWith('/watch'))) return;
  queuedTasks.forEach(({ task, attempts }) => {
    const { success, retryTask, maxAttemptsReached } = injectComponent(task, attempts);
    if (!(success ?? false) && !maxAttemptsReached) {
      // batch retry logic
      retries.push({ task: retryTask, attempts: attempts + 1 });
    }
  });

  if (retries.length) {
    queuedTasks = retries;
    setTimeout(() => {
      // page has changed no need to retry
      if (currentPageId !== pageId) {
        logger.info('Page has changed');
        return;
      }
      init();
    }, 300);
  }
}
if (IS_DEV) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init);
  });
} else {
  document.addEventListener('yt-navigate-finish', () => {
    setTimeout(init);
  });
  document.addEventListener('yt-navigate-start', () => {
    cleanUp([clearVideoDetailsMap, clearEvents, () => cleanupMountedRoots(MOUNTED_ROOTS)]);
    // change page snapshot id on each navigation start
    pageId = Date.now();
  });
}
