import type { RequestHandler } from '@/hooks/useRequest';
import type { Profile } from '@/types/storage';
import { getEnvKeys } from '@/utils/lib/helpers';
import type { DeepNullable } from '@shared/types/helpers';

import type { SyncProfilePayload, User } from '../types/user';

export type InitialProfile = DeepNullable<Profile>;
export const initialProfile: InitialProfile = {
  user: {
    id: null,
    username: null,
    accessKey: null,
    signingKey: null,
    userNameChanged: null,
    userReputation: null,
  },
  rateLimits: {
    notes: {
      retryAt: null,
    },
    ratings: {
      retryAt: null,
    },
    syncProfile: {
      retryAt: null,
      attemptsLeft: null,
    },
  },
};

export function generateUserHandler(): RequestHandler<User, []> {
  const controller = new AbortController();
  return {
    shouldAbort: false,
    abortRequest: () => controller.abort(),
    fetchHandler: () => {
      const URL = getEnvKeys('VITE_SUPABASE_CREATE_USER_URL');

      return fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getEnvKeys('VITE_SUPABASE_ANON_KEY')}`,
        },
        signal: controller.signal,
      });
    },
  };
}

export function importProfileHandler(): RequestHandler<
  Omit<User, 'accessKey'>,
  [SyncProfilePayload]
> {
  const controller = new AbortController();
  return {
    shouldAbort: false,
    abortRequest: () => controller.abort(),
    fetchHandler: (payload: SyncProfilePayload) => {
      const URL = getEnvKeys('VITE_SUPABASE_SYNC_PROFILE_URL');

      return fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getEnvKeys('VITE_SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    },
  };
}
