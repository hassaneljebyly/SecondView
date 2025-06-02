import { createRoot, type Root } from "react-dom/client";
import type { InjectTask } from "./componentTasks";
import { getOrCreateRootWrapper } from "./dom";

const MAX_ATTEMPTS = 5;

export const ROOTS = new Map<string, Root>();

export function injectComponent(task: InjectTask, attempts: number = 0) {
  const { domTargetSelector, rootWrapperId, componentId, component } = task;
  // component already in the dom
  if (document.getElementById(componentId)) return;

  const rootWrapper = getOrCreateRootWrapper(rootWrapperId, domTargetSelector);
  // polling the DOM until root wrapper is found
  if (rootWrapper) {
    // mount the react component into the wrapper
    const root = createRoot(rootWrapper);
    ROOTS.set(rootWrapperId, root);
    root.render(component);
  } else {
    // retry polling until MAX_ATTEMPTS is reached
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(() => {
        injectComponent(task, attempts + 1);
      }, 500);
    } else {
      console.error(`MAX attempts reached for node of id: ${componentId}`);
    }
  }
}
