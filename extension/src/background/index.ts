import { logger } from '@/utils/lib/logger';

chrome.runtime.onInstalled.addListener(details => {
  logger.info(details);
});

chrome.runtime.onInstalled.addListener(async () => {
  const { username } = await chrome.storage.local.get('username');

  //   if (!username) {
  //     // First time - generate credentials
  //     // const username = generateRandomUserName();
  //     // const accessKey = crypto.randomUUID();

  //     await chrome.storage.local.set({
  //       username: 'username_fake',
  //       access_key: 'accessKey_fake',
  //     });

  //     // Show welcome with option to save credentials
  // }
  logger.info('testing on install success', { username });
});
