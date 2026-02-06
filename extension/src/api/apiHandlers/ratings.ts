import type { RequestHandler } from '@/hooks/useRequest';
import { getEnvKeys } from '@/utils/lib/helpers';

import { createCanonicalMessage } from '../auth/canonicalMessage';
import { getHMACSignature } from '../auth/hmacSigning';
import type { CanonicalFields } from '../types/auth';
import type { NoteAccuracyResponse, RatingSubmissionPayload } from '../types/ratings';
import type { User } from '../types/user';

export function submitRating(): RequestHandler<
  NoteAccuracyResponse[],
  [User['user']['id'], User['user']['signingKey'], RatingSubmissionPayload]
> {
  const controller = new AbortController();

  return {
    abortRequest: () => controller.abort(),
    fetchHandler: async (userId, signingKey, ratingBody) => {
      const METHOD = 'POST';
      const REQUEST_URL = getEnvKeys('VITE_SUPABASE_SUBMIT_RATING_URL');

      const submitNoteCanonicalFields: CanonicalFields['submit-rating'] = {
        ...ratingBody.noteData,
        ...ratingBody.ratingData,
      };

      const urlPath = new URL(REQUEST_URL).pathname;
      const canonicalPath = urlPath.replace(/^\/functions\/v\d+/, '');

      const requestTimestamp = new Date().toISOString();
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
        body: JSON.stringify(ratingBody),
      });
    },
  };
}
