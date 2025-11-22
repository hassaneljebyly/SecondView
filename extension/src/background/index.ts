import { StoreModel } from '@/utils/lib/storage';
import { createNewUserAndAccessKey } from '@shared/utils/format/generateUserName';

chrome.runtime.onInstalled.addListener(async () => {
  StoreModel.initializeStoreIfNoneExist('profile', createNewUserAndAccessKey);
});
