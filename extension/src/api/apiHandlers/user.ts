import type { RequestHandler } from '@/hooks/useRequest';
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

export function generateUserHandler(_options?: unknown): RequestHandler<User> {
  const controller = new AbortController();
  const LOCAL_URL = 'http://127.0.0.1:54321/functions/v1/create-user';
  const PROD_URL = 'https://<project-id>.supabase.co/functions/v1/create-user';

  const URL = LOCAL_URL;

  return {
    abortRequest: () => controller.abort(),
    fetchHandler: () =>
      fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env['VITE_SUPABASE_ANON_KEY']}`,
        },
        signal: controller.signal,
      }),
  };
}
