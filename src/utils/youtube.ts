import type { VideoMetaData } from "../types";
import { GlobalError } from "./error";

export function getVideoDetails(): VideoMetaData | never {
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

    const videoLength =
      Math.floor(document.querySelector("video")?.duration || 0) || null;

    const videoTitle =
      (document.querySelector("#title h1") as HTMLHeadElement)?.innerText ||
      null;

    const videoId =
      new URLSearchParams(window.location.search).get("v") ||
      window.location.pathname.match(/\/watch\/([^/]+)/)?.[1] ||
      null;
    const videoMetaData = {
      videoId,
      channelId,
      channelName,
      videoTitle,
      videoLength,
    };
    const videoMetaDataScrappedSuccessfully = Object.values(
      videoMetaData
    ).every((value) => value !== null);

    if (videoMetaDataScrappedSuccessfully) {
      return videoMetaData as VideoMetaData;
    } else {
      throw Error();
    }
  } catch (error) {
    console.warn("Failed to get video details:", error);
    // [🧱 REFACTOR]: make GlobalError payload optional
    throw new GlobalError({
      global: {
        target: "form",
        message:
          "Sorry, we couldn't get all the necessary video details. Please try again later.",
      },
    });
  }
}

export function getVideoId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("v");
}
