import type { ValidationError } from "./validation";

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

export function showErrors(errors: ValidationError[]) {
  errors.forEach(({ field, message }) => {
    const input = document.querySelector(
      `#sv-note__form [name="${field}"]`
    ) as HTMLInputElement;
    const errorHint = document.querySelector(
      `#sv-note__form [name="${field}"] + span`
    ) as HTMLSpanElement;

    input?.classList.add("invalid");
    errorHint.innerHTML = message;
  });
}

export function cleanUpErrors() {
  const invalidInput = document.querySelectorAll("#sv-note__form .invalid");
  const hintSpan = document.querySelectorAll("#sv-note__form .invalid + span");
  invalidInput.forEach((input) => {
    input.classList.remove("invalid");
  });
  hintSpan.forEach((span) => {
    span.innerHTML = "";
  });
}
