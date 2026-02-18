import { useEffect, useState } from 'react';

import { initialProfile, type InitialProfile } from '@/api/apiHandlers/user';
import type { Profile, StoreUpdater } from '@/types/storage';
import { profileStore } from '@/utils/lib/storage';
import type { NestedKeyOf, NestedValue } from '@shared/types/helpers';
import { getNestedValue } from '@shared/utils/helpers/objectHelpers';

export default function useProfile() {
  const [profile, setProfile] = useState<InitialProfile>(initialProfile);
  function pick<T extends NestedKeyOf<InitialProfile>>(
    fieldSelector: T
  ): NestedValue<InitialProfile, T> {
    // getNestedValue returns undefined if the key doesn't exist, highly unlikely, so just ignore for now
    return getNestedValue(profile, fieldSelector)!;
  }
  function update<T extends NestedKeyOf<InitialProfile>>(
    fieldSelector: T,
    handler: StoreUpdater<Profile, T>
  ) {
    return profileStore.update(fieldSelector, handler);
  }

  useEffect(() => {
    if (profile.user.id === null) {
      profileStore.get().then(result => {
        if (result.status === 'ready' && result.storeValue.user.id !== null) {
          setProfile(result.storeValue);
        }
      });
    }
    const profileChangeEvent = profileStore.onChange('*', (_oldProfile, newProfile) => {
      setProfile(newProfile);
    });
    return () => {
      profileChangeEvent();
    };
  });

  return { profile, pick, update };
}
