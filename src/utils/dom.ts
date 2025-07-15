import type { Root } from "react-dom/client";
import { withPrefix } from "./helpers";
import { videoDetailsMap } from "./youtube";

export function resetForm() {
  const form = document.querySelector(
    `.${withPrefix("form")}`
  ) as HTMLFormElement;
  if (form) form.reset();
}
export function getOrCreateRootWrapper(
  rootWrapperId: string,
  domTargetSelector: string
): HTMLElement | null {
  let rootWrapper = document.getElementById(rootWrapperId);
  if (!rootWrapper) {
    const domTarget = document.querySelector(domTargetSelector);
    if (!domTarget) return null;
    rootWrapper = document.createElement("div");
    rootWrapper.id = rootWrapperId;
    // append the react component wrapper into the target element
    domTarget.appendChild(rootWrapper);
  }
  return rootWrapper;
}

export function focusFirstElement(formOpen: boolean) {
  // focus first form field
  if (!formOpen) {
    // ensures the field is focused after the form render
    requestAnimationFrame(() => {
      const field = document.querySelector(
        `.${withPrefix("form__field")}`
      ) as HTMLInputElement;
      if (field) field.focus();
    });
  }
}

export function cleanUp(rootsMap: Map<string, Root>) {
  videoDetailsMap.clear();
  for (const [wrapperId, root] of rootsMap) {
    root.unmount();
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.remove();
    rootsMap.delete(wrapperId);
  }
}
