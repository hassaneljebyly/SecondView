import { useEffect, useState } from 'react';

import { getNotes } from '@/api/apiHandlers/notes';
import type { NoteResponse } from '@/api/types/notes';
import type { ShowSnackBarEvent } from '@/utils/config/customEventsConfig';
import { globalCacheSingleton, type CacheConfig, type CachedNotesMap } from '@/utils/lib/cache';
import { globalEventSingleton } from '@/utils/lib/events';
import { mapValuesToArray } from '@/utils/lib/helpers';
import { logger } from '@/utils/lib/logger';
import { profileStore } from '@/utils/lib/storage';

import useRequest from './useRequest';

type ReplaceNoteEventParams = {
  optimisticId: string;
  realNote: NoteResponse;
};

/**
 * Notes are shared across multiple React roots.
 * The global cache is the single source of truth.
 * Local React state only mirrors cache changes.
 */
export default function useNotes(videoId: string | null) {
  const notesFetchCacheConfig: CacheConfig = {
    key: `fetch.notesOf=${videoId}`,
    ttl: 'navigation',
  };

  const notesCacheConfig: CacheConfig = {
    key: `notesOf=${videoId}`,
    ttl: 'navigation',
  };

  const {
    data,
    run: runGetNotes,
    isError,
    isLoading,
    setData,
  } = useRequest(getNotes, notesFetchCacheConfig);

  // local state is a projection of the cache
  const [notes, setNotes] = useState<NoteResponse[]>([]);

  // cache mutation commands
  // add a note (optimistic or real) to the shared cache
  function dispatchNewNotes(newNotes: NoteResponse[]) {
    const notesMap = globalCacheSingleton.get<CachedNotesMap>(notesCacheConfig.key) ?? new Map();
    newNotes.forEach(newNoteItem => {
      notesMap.set(newNoteItem.id, newNoteItem);
    });
    globalCacheSingleton.set(notesCacheConfig, notesMap);
  }

  // replace an optimistic note with the real one
  function dispatchReplaceNote({ optimisticId, realNote }: ReplaceNoteEventParams) {
    const notesMap = globalCacheSingleton.get<CachedNotesMap>(notesCacheConfig.key) ?? new Map();

    notesMap.delete(optimisticId);
    notesMap.set(realNote.id, realNote);

    globalCacheSingleton.set(notesCacheConfig, notesMap);
  }

  // remove a note from the shared cache
  function dispatchRemoveNote(noteId: string) {
    const notesMap = globalCacheSingleton.get<CachedNotesMap>(notesCacheConfig.key) ?? new Map();

    notesMap.delete(noteId);
    globalCacheSingleton.set(notesCacheConfig, notesMap);
  }

  // Cache => React sync
  useEffect(() => {
    if (!data) return;
    const notesMap = globalCacheSingleton.get<CachedNotesMap>(notesCacheConfig.key) || new Map();

    data.data.forEach(note => {
      notesMap.set(note.id, note);
    });

    globalCacheSingleton.set(notesCacheConfig, notesMap);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  // fetch on video change
  useEffect(() => {
    if (!videoId) {
      logger.error("Couldn't get video id");
      globalEventSingleton.emit('snackBar:show', window, {
        detail: {
          text: "Couldn't get video id",
          status: 'error',
        } as ShowSnackBarEvent,
      });
      return;
    }

    let userId: string | null = null;

    profileStore
      .get('user.id')
      .then(result => {
        if (result.status === 'ready') {
          userId = result.storeValue;
          runGetNotes(videoId, userId);
        }
      })
      .catch(error => {
        logger.error('Something went wrong while getting userId from storage', error);
        runGetNotes(videoId, userId);
      });

    // subscribe to cache changes.
    // every root updates its local React state from the cache.
    const unsubscribe = globalCacheSingleton.onChange<CachedNotesMap>(
      notesCacheConfig.key,
      (_old, newNotes) => {
        setNotes(mapValuesToArray(newNotes));
      }
    );

    return () => {
      // Prevent stale data from leaking between video IDs
      setData(null);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  if (isError) {
    logger.error("Couldn't fetch notes");
    globalEventSingleton.emit('snackBar:show', window, {
      detail: {
        text: "Couldn't get notes for this video",
        status: 'error',
      } as ShowSnackBarEvent,
    });
  }
  return {
    isError,
    isLoading,
    notes,
    dispatchNewNotes,
    dispatchReplaceNote,
    dispatchRemoveNote,
  };
}
