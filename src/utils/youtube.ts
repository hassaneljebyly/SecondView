export type VideoData = {
  videoId: string | null;
  channelId: string | null;
  channelName: string | null;
  videoTitle: string | null;
  videoLength: number | null;
};

export function getVideoDetails(): VideoData {
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
    // [🐞 BUG]: shouldn't return null, if no video data exists, saving note request shouldn't proceed
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
