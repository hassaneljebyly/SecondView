import { tasks } from "../utils/componentTasks";
import { cleanUp } from "../utils/dom";
import { injectComponent, ROOTS, type InjectTask } from "../utils/injector";
import "../styles/content/index.scss";

export type Retries = { task: InjectTask; attempts: number };

let pageId = Date.now();

let queuedTasks: Retries[] = tasks.map((task) => ({
  task,
  attempts: 0,
}));

function init() {
  const currentPageId = pageId;
  const retries: Retries[] = [];

  if (window.location.pathname !== "/watch") return;

  queuedTasks.forEach(({ task, attempts }) => {
    const { success, retryTask, maxAttemptsReached } = injectComponent(
      task,
      attempts
    );
    if (!success && !maxAttemptsReached) {
      // batch retry logic
      retries.push({ task: retryTask, attempts: attempts + 1 });
    }
  });

  if (retries.length) {
    queuedTasks = retries;
    setTimeout(() => {
      // page has changed no need to retry
      if (currentPageId !== pageId) {
        console.log("Page has changed");
        return;
      }
      init();
    }, 300);
  }
}

document.addEventListener("yt-navigate-finish", () => {
  setTimeout(init);
});
document.addEventListener("yt-navigate-start", () => {
  cleanUp(ROOTS);
  pageId = Date.now(); // change page snapshot id on each navigation start
});
