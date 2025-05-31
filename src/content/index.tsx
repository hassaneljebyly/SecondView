import { createRoot, type Root } from "react-dom/client";
import Button from "../components/Button";

document.addEventListener("yt-navigate-start", cleanUp);
document.addEventListener("yt-navigate-finish", init);

const MAX_ATTEMPTS = 5;
const ROOTS = new Map<string, Root>();

function cleanUp() {
  console.log("before Clean Up", ROOTS);
  for (const [wrapperId, root] of ROOTS) {
    root.unmount();
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.remove();
    ROOTS.delete(wrapperId);
  }
  console.log("after Clean Up", ROOTS);
}

function init() {
  console.log("At Start", ROOTS);
  if (window.location.pathname === "/watch") {
    console.log("navigate to:", window.location.pathname);
    injectComponent("sv-button", "sv-note-container", "#actions", <Button />);
  }
}

function injectComponent(
  componentId: string,
  rootWrapperId: string,
  domTargetSelector: string,
  Component: React.ReactElement,
  attempts: number = 0
) {
  const componentAlreadyInjected = Boolean(
    document.getElementById(componentId)
  );
  if (componentAlreadyInjected) {
    console.log("Component Already In Page");
    return;
  }
  if (!componentAlreadyInjected) {
    let rootWrapper = document.getElementById(rootWrapperId);
    if (!rootWrapper) {
      const domTarget = document.querySelector(domTargetSelector);
      if (domTarget) {
        rootWrapper = document.createElement("div");
        rootWrapper.id = rootWrapperId;
        domTarget.appendChild(rootWrapper);
        //
        const root = createRoot(rootWrapper);
        ROOTS.set(rootWrapperId, root);
        root.render(Component); // targetComponent
      } else {
        if (attempts < MAX_ATTEMPTS) {
          setTimeout(() => {
            injectComponent(
              componentId,
              rootWrapperId,
              domTargetSelector,
              Component,
              attempts + 1
            );
          }, 500);
        } else {
          console.log("MAX attempts reached for node: Button");
        }
      }
    }
    console.log("Component Successfully Injected");
  }
}
