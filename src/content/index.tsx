import { tasks } from "../componentTasks";
import { injectComponent, ROOTS } from "../injector";

function cleanUp() {
  for (const [wrapperId, root] of ROOTS) {
    root.unmount();
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.remove();
    ROOTS.delete(wrapperId);
  }
}

function init() {
  if (window.location.pathname !== "/watch") return;
  tasks.forEach(injectComponent);
}
document.addEventListener("yt-navigate-start", cleanUp);
document.addEventListener("yt-navigate-finish", init);
