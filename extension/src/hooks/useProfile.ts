import { useEffect, useState } from 'react';

import type { Profile, ProfileKeys } from '@/types/storage';
import { IS_DEV } from '@/utils/config/loggerConfig';
import { logger } from '@/utils/lib/logger';
import { DevStoreModel, StoreModel } from '@/utils/lib/storage';

const profileStore = IS_DEV ? new DevStoreModel('profile') : new StoreModel('profile');

export default function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  async function getField<K extends ProfileKeys>(field: K): Promise<Profile[K] | null> {
    try {
      const result = (await profileStore.get(field)) as Profile[K] | null;
      return result;
    } catch (error) {
      logger.error(`Something went wrong while getting ${field}`, error);
      return null;
    }
  }

  async function updateStoredProfile<K extends Partial<Profile>>(partial: K) {
    try {
      profileStore.update(partial);
    } catch (error) {
      logger.error(`Something went wrong while updating Profile width ${partial}`, error);
    }
  }

  useEffect(() => {
    if (!profile) {
      profileStore.get().then(result => {
        if (typeof result === 'object') setProfile(result);
      });
    }

    const profileSubscriber = profileStore.onChange(newVal => {
      setProfile(newVal);
    });

    return () => {
      profileSubscriber();
    };
  });

  return {
    profile: profile || { userName: 'N/A', accessKey: 'N/A' },
    readStorageField: getField,
    updateStorageField: updateStoredProfile,
  };
}
