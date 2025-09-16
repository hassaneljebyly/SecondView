import { secondsToTimeString } from '@shared/utils/format/timeStamp';

import { logger } from '../lib/logger';

export function getCurrentTime() {
  try {
    const video = document.querySelector('video') as HTMLVideoElement | null;
    if (!video) {
      logger.error(`No <video> element found`);
      return null;
    }
    return secondsToTimeString(Math.floor(video.currentTime));
  } catch (error) {
    logger.error(`Something went wrong while getting video.currentTime`, error);
    return null;
  }
}
