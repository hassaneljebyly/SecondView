import type { RequestHandler } from '@/hooks/useRequest';
import { getEnvKeys } from '@/utils/lib/helpers';
import type { DeepNullable } from '@shared/types/helpers';

import type { User } from '../types/user';

export type InitialUser = DeepNullable<User>;
export const initialUser: InitialUser = {
  user: {
    id: null,
    username: null,
    accessKey: null,
    signingKey: null,
    userNameChanged: null,
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
