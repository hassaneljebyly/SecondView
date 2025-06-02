import { tasks, type InjectTask } from "../componentTasks";
import { injectComponent, ROOTS } from "../injector";

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
    setTimeout(init, 300);
  }
}

document.addEventListener("yt-navigate-start", cleanUp);
document.addEventListener("yt-navigate-finish", init);
