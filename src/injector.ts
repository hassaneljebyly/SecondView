import { createRoot, type Root } from "react-dom/client";
import type { InjectTask } from "./componentTasks";
import { getOrCreateRootWrapper } from "./dom";

const MAX_ATTEMPTS = 5;
export const ROOTS = new Map<string, Root>();

type InjectComponentResult =
  | {
      maxAttemptsReached?: never;
      success: true;
      retryTask?: never;
      attempts?: never;
    }
  | {
      maxAttemptsReached?: never;
      success: false;
      retryTask: InjectTask;
      attempts: number;
    }
  | {
      maxAttemptsReached: true;
      success?: never;
      retryTask?: never;
      attempts?: never;
    };

export function injectComponent(
  task: InjectTask,
  attempts: number = 0
): InjectComponentResult {
  const { domTargetSelector, rootWrapperId, componentId, component } = task;
  // component already in the dom
  if (document.getElementById(componentId)) {
    return {
      success: true,
    };
  }

  const rootWrapper = getOrCreateRootWrapper(rootWrapperId, domTargetSelector);
  // polling the DOM until root wrapper is found
  if (rootWrapper) {
    // mount the react component into the wrapper
    const root = createRoot(rootWrapper);
    ROOTS.set(rootWrapperId, root);
    root.render(component);
  }
  // retry polling until MAX_ATTEMPTS is reached
  if (attempts < MAX_ATTEMPTS) {
    return {
      success: false,
      retryTask: task,
      attempts: attempts + 1,
    };
  } else {
    console.error(`MAX attempts reached for node of id: ${componentId}`);
    return {
      maxAttemptsReached: true,
    };
  }
}
