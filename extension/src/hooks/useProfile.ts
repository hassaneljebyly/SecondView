import { useEffect, useState } from 'react';

import { initialUser, type InitialUser } from '@/api/apiHandlers/user';
import type { User } from '@/api/types/user';
import type { StoreUpdater } from '@/types/storage';
import { profileStore } from '@/utils/lib/storage';
import type { NestedKeyOf } from '@shared/types/helpers';
import { getNestedValue } from '@shared/utils/helpers/objectHelpers';

export default function useProfile() {
  const [profile, setProfile] = useState<InitialUser>(initialUser);
  function pick(fieldSelector: NestedKeyOf<InitialUser>) {
    return getNestedValue(profile, fieldSelector);
  }
  function update<T extends NestedKeyOf<InitialUser>>(
    fieldSelector: T,
    handler: StoreUpdater<User, T>
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
