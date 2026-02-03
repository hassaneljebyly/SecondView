import { initialUser } from '@/api/apiHandlers/user';
import { StoreModel } from '@/utils/lib/storage';

chrome.runtime.onInstalled.addListener(async () => {
  StoreModel.initializeStoreIfNoneExist('profile', () => initialUser);
});
