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
  errors.forEach(({ field, message }, index) => {
    const input = document.querySelector(
      `#sv-note__form [name="${field}"]`
    ) as HTMLInputElement;
    const errorHint = document.querySelector(
      `#sv-note__form [name="${field}"] + span`
    ) as HTMLSpanElement;

    input?.classList.add("invalid");
    errorHint.innerHTML = message;

    if (index === 0) input.focus();
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

export type VideoDetails = {
  videoId: string | null;
  channelId: string | null;
  channelName: string | null;
  videoTitle: string | null;
  videoLength: number | null; // in seconds
};

export function getVideoDetails(): VideoDetails {
  try {
    const channelName =
      (
        document.querySelector(
          '#upload-info a[href^="/@"]'
        ) as HTMLAnchorElement
      )?.innerText || null;

    const url = document
      .querySelector('[href*="/channel/"]')
      ?.getAttribute("href");
    const channelId = url?.match(/channel\/([A-Za-z0-9_-]+)/)?.[1] || null;

    const videoLength = document.querySelector("video")?.duration || null;

    const videoTitle =
      (document.querySelector("#title h1") as HTMLHeadElement)?.innerText ||
      null;

    const videoId =
      new URLSearchParams(window.location.search).get("v") ||
      window.location.pathname.match(/\/watch\/([^/]+)/)?.[1] ||
      null;

    return { videoId, channelId, channelName, videoTitle, videoLength };
  } catch (error) {
    console.warn("Failed to scrape video details:", error);
    return {
      videoId: null,
      channelId: null,
      channelName: null,
      videoTitle: null,
      videoLength: null,
    };
  }
}
