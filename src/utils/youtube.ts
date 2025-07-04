import { testVideoDetails } from "../api/mock-data";
import type { VideoMetaData } from "../types";
import { GlobalError } from "./error";

// export only to clear old data during clean
export const videoDetailsMap = new Map<keyof VideoMetaData, string | number>();
export function getVideoDetails(): VideoMetaData | never {
  if (import.meta.env.DEV) {
    return testVideoDetails;
  }
  try {
    // channel name
    const channelName =
      videoDetailsMap.get("channelName") ||
      (
        document.querySelector(
          '#upload-info a[href^="/@"]'
        ) as HTMLAnchorElement
      )?.innerText ||
      (document.querySelector("ytd-channel-name a") as HTMLAnchorElement)
        ?.innerText;

    // channel ID
    const channelLink = document.querySelector('[href*="/channel/"]');
    const channelUrl = channelLink?.getAttribute("href");
    const channelId =
      videoDetailsMap.get("channelId") ||
      channelUrl?.match(/channel\/([A-Za-z0-9_-]+)/)?.[1];

    // video duration
    const videoLength =
      videoDetailsMap.get("videoLength") ||
      Math.floor(document.querySelector("video")?.duration || 0);

    // video title
    const videoTitle =
      videoDetailsMap.get("videoTitle") ||
      (document.querySelector("#title h1") as HTMLHeadingElement)?.innerText ||
      (
        document.querySelector(
          "h1.ytd-video-primary-info-renderer"
        ) as HTMLHeadingElement
      )?.innerText;

    // video ID from URL
    const videoId =
      videoDetailsMap.get("videoId") ||
      new URLSearchParams(window.location.search).get("v");

    const videoMetaData = {
      videoId,
      channelId,
      channelName,
      videoTitle,
      videoLength,
    };

    // check if all required data was scraped successfully
    const videoMetaDataScrappedSuccessfully = Object.values(
      videoMetaData
    ).every((value) => value !== null && value !== undefined && value !== "");

    if (videoMetaDataScrappedSuccessfully) {
      // cache for later use
      for (const [key, value] of Object.entries(videoMetaData)) {
        videoDetailsMap.set(key as keyof VideoMetaData, value!);
      }
      return videoMetaData as VideoMetaData;
    } else {
      throw new Error("Incomplete video metadata");
    }
  } catch (error) {
    console.warn("Failed to get video details:", error);
    throw new GlobalError({
      global: {
        target: "form",
        message:
          "Sorry, we couldn't get all the necessary video details. Please try again later.",
      },
    });
  }
}
