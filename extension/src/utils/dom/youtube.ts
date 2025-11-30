import { testVideoDetails } from '@shared/mocks/youtube';
import type { VideoMetaData } from '@shared/types/youtube-data';

import { IS_DEV } from '../config/loggerConfig';
import { logger } from '../lib/logger';

// [🧱 REFACTOR]: get video data later via api
export function getVideoDetails(): VideoMetaData {
  if (IS_DEV) return testVideoDetails;
  try {
    // channel name
    const channelName =
      (document.querySelector('#upload-info a[href^="/@"]') as HTMLAnchorElement)?.innerText ??
      (document.querySelector('ytd-channel-name a') as HTMLAnchorElement)?.innerText;

    // channel ID
    const channelLink = document.querySelector('[href*="/channel/"]');
    const channelUrl = channelLink?.getAttribute('href');
    const channelId = channelUrl?.match(/channel\/([A-Za-z0-9_-]+)/)?.[1];

    // video duration
    const videoLength = Math.floor(document.querySelector('video')?.duration ?? 0);

    // video title
    const videoTitle =
      (document.querySelector('#title h1') as HTMLHeadingElement)?.innerText ??
      (document.querySelector('h1.ytd-video-primary-info-renderer') as HTMLHeadingElement)
        ?.innerText;

    // video ID from URL
    const videoId = new URLSearchParams(window.location.search).get('v');

    const videoMetaData = {
      videoId,
      channelId,
      channelName,
      videoTitle,
      videoLength,
    };

    return videoMetaData as VideoMetaData;
  } catch (error) {
    logger.error('Failed to get video details:', error);
    return {
      videoId: new URLSearchParams(window.location.search).get('v') || '',
      channelId: '',
      channelName: '',
      videoTitle: '',
      videoLength: 0,
    };
  }
}
