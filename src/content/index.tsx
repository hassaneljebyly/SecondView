import { tasks, type InjectTask } from "../utils/componentTasks";
import { injectComponent, ROOTS } from "../utils/injector";

let pageId = Date.now();

function cleanUp() {
  for (const [wrapperId, root] of ROOTS) {
    root.unmount();
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.remove();
    ROOTS.delete(wrapperId);
  }
}

type Retries = { task: InjectTask; attempts: number };
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
  cleanUp();
  pageId = Date.now(); // change page snapshot id on each navigation start
});
