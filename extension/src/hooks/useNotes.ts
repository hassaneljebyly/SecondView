import { useEffect } from 'react';

import { getNotes } from '@/api/apiHandlers/notes';
import { logger } from '@/utils/lib/logger';
import { profileStore } from '@/utils/lib/storage';

import useRequest from './useRequest';

export function useNotes(videoId?: string) {
  const { data, run, isError, isLoading, setData } = useRequest(getNotes);

  useEffect(() => {
    if (!videoId) return;
    let userId: string | null = null;
    profileStore
      .get('user.id')
      .then(result => {
        if (result.status === 'ready') {
          userId = result.storeValue;
          run(videoId, userId); // run with userId or null
        } else {
          run(videoId, userId); // run without user id if store wasn't initialized
        }
      })
      .catch(error => {
        logger.error('Something went wrong while getting userId from storage', error);
        run(videoId, userId); // still run if there was ever an issue
      });
    return () => {
      setData(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]); // only care about video id change

  return {
    isError,
    isLoading,
    notes: data || [],
  };
}
