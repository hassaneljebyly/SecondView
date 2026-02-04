import type { RequestHandler } from '@/hooks/useRequest';

import type { NoteResponse } from '../types/notes';
import type { User } from '../types/user';

export function getNotes(
  videoId: string,
  userId: User['user']['id'] | null
): RequestHandler<NoteResponse> {
  const controller = new AbortController();
  const search = new URLSearchParams({
    video_id: videoId,
    ...(userId && { user_id: userId }),
  }).toString();
  const LOCAL_URL = `http://127.0.0.1:54321/functions/v1/fetch-notes?${search}`;
  // const PROD_URL = `https://<project-id>.supabase.co/functions/v1/fetch-notes?${search}`;
  const URL = LOCAL_URL; // change to PROD_URL in production
  // DOCS(me): 📘 remove `body: JSON.stringify(noteBody),` from docs in `./docs/endpoints/fetch-notes.md`

  return {
    abortRequest: () => controller.abort(),
    fetchHandler: () =>
      fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env['VITE_SUPABASE_ANON_KEY']}`,
        },
        signal: controller.signal,
      }),
  };
}
