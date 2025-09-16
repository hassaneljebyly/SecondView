export function getOrCreateRootWrapper(
  rootWrapperId: string,
  domTargetSelector: string
): HTMLElement | null {
  let rootWrapper = document.getElementById(rootWrapperId);
  if (!rootWrapper) {
    const domTarget = document.querySelector(domTargetSelector);
    if (!domTarget) return null;
    rootWrapper = document.createElement('div');
    rootWrapper.id = rootWrapperId;
    // append the react component wrapper into the target element
    domTarget.appendChild(rootWrapper);
  }
  return rootWrapper;
}
