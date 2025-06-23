import { createRoot, type Root } from "react-dom/client";
import { getOrCreateRootWrapper } from "./dom";
import { MAX_ATTEMPTS } from "./constant";

export type InjectTask = {
  domTargetSelector: string; // Where to inject it in the DOM
  rootWrapperId: string; // ID for the root wrapper
  componentId: string; // Unique ID for the injected component
  component: React.ReactElement; // The React component itself
};

export type InjectComponentResult =
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

export const ROOTS = new Map<string, Root>();

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
    return {
      success: true,
    };
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
