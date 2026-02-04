import type { RequestHandler } from '@/hooks/useRequest';

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
      const LOCAL_URL = 'http://127.0.0.1:54321/functions/v1/submit-rating';
      // const PROD_URL = "https://<project-id>.supabase.co/functions/v1/submit-rating";
      const METHOD = 'POST';
      const REQUEST_URL = LOCAL_URL; // change to PROD_URL in production

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
          Authorization: `Bearer ${import.meta.env['VITE_SUPABASE_ANON_KEY']}`,
        },
        body: JSON.stringify(ratingBody),
      });
    },
  };
}
