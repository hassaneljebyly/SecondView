import type { RequestHandler } from '@/hooks/useRequest';
import { getEnvKeys } from '@/utils/lib/helpers';

import { createCanonicalMessage } from '../auth/canonicalMessage';
import { getHMACSignature } from '../auth/hmacSigning';
import type { CanonicalFields } from '../types/auth';
import type { CreatedNoteResponse, NoteResponse, NoteSubmissionPayload } from '../types/notes';
import type { User } from '../types/user';

export function getNotes(): RequestHandler<NoteResponse[], [string, User['user']['id'] | null]> {
  const controller = new AbortController();

  return {
    shouldAbort: true,
    abortRequest: () => controller.abort(),
    fetchHandler: (videoId, userId) => {
      const search = new URLSearchParams({
        video_id: videoId,
        ...(userId && { user_id: userId }),
      }).toString();

      const LOCAL_URL = `${getEnvKeys('VITE_SUPABASE_FETCH_NOTES_URL')}?${search}`;
      const URL = LOCAL_URL;

      return fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getEnvKeys('VITE_SUPABASE_ANON_KEY')}`,
        },
        signal: controller.signal,
      });
    },
  };
}

export function submitNote(): RequestHandler<
  CreatedNoteResponse,
  [User['user']['id'], User['user']['signingKey'], NoteSubmissionPayload]
> {
  const controller = new AbortController();

  return {
    shouldAbort: false,
    abortRequest: () => controller.abort(),
    fetchHandler: async (userId, signingKey, noteSubmissionPayload) => {
      const METHOD = 'POST';
      const REQUEST_URL = getEnvKeys('VITE_SUPABASE_SUBMIT_NOTE_URL');
      const submitNoteCanonicalFields: CanonicalFields['submit-note'] = {
        ...noteSubmissionPayload.noteData,
        ...noteSubmissionPayload.videoMetaData,
      };
      const requestTimestamp = new Date().toISOString();
      const urlPath = new URL(REQUEST_URL).pathname;
      const canonicalPath = urlPath.replace(/^\/functions\/v\d+/, '');
      const requestMessage = createCanonicalMessage(
        canonicalPath,
        submitNoteCanonicalFields,
        requestTimestamp,
        METHOD
      );
      const signedRequestMessage = await getHMACSignature(signingKey, requestMessage);

      return fetch(REQUEST_URL, {
        method: METHOD, // or GET if your function allows
        headers: {
          'Request-Timestamp': requestTimestamp,
          'Request-Signature': `HMAC-SHA256 Credential=${userId}, Signature=${signedRequestMessage}`,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getEnvKeys('VITE_SUPABASE_ANON_KEY')}`,
        },
        signal: controller.signal,
        body: JSON.stringify(noteSubmissionPayload),
      });
    },
  };
}
