import { useEffect, useState } from 'react';

import { getNotes } from '@/api/apiHandlers/notes';
import type { NoteResponse } from '@/api/types/notes';
import { globalEventSingleton } from '@/utils/lib/events';
import { logger } from '@/utils/lib/logger';
import { profileStore } from '@/utils/lib/storage';

import useRequest from './useRequest';

type ReplaceNoteEventParams = {
  optimisticId: string;
  realNote: NoteResponse;
};

export default function useNotes(videoId: string | null) {
  const {
    data,
    run: runGetNotes,
    isError,
    isLoading,
    setData,
  } = useRequest(getNotes, {
    key: `fetch.notesOf=${videoId}`,
    ttl: 'navigation',
  });
  const [notes, setNotes] = useState<NoteResponse[]>([]);

  function dispatchNewNote(newNote: NoteResponse) {
    globalEventSingleton.emit('note:add', window, { detail: newNote });
  }

  function dispatchReplaceNote({ optimisticId, realNote }: ReplaceNoteEventParams) {
    globalEventSingleton.emit('note:replace', window, { detail: { optimisticId, realNote } });
  }
  function dispatchRemoveNote(optimisticId: string) {
    globalEventSingleton.emit('note:remove', window, { detail: optimisticId });
  }

  useEffect(() => {
    if (data) {
      setNotes(data['data']);
    }
    const addNewNoteEvent = globalEventSingleton.on('note:add', e => {
      const { detail: newNote } = e as CustomEvent<NoteResponse>;
      setNotes(prevNotes => {
        return [...prevNotes, newNote];
      });
    });
    const replaceNoteEvent = globalEventSingleton.on('note:replace', e => {
      const {
        detail: { optimisticId, realNote },
      } = e as CustomEvent<ReplaceNoteEventParams>;
      setNotes(prevNotes => {
        return prevNotes.map(noteItem => {
          if (noteItem.id === optimisticId) return realNote;
          return noteItem;
        });
      });
    });
    const removeNoteEvent = globalEventSingleton.on('note:remove', e => {
      const { detail: optimisticId } = e as CustomEvent<string>;
      setNotes(prevNotes => {
        const newNotes = prevNotes.filter(noteItem => noteItem.id !== optimisticId);
        return newNotes;
      });
    });
    return () => {
      addNewNoteEvent.disconnectEvent();
      replaceNoteEvent.disconnectEvent();
      removeNoteEvent.disconnectEvent();
    };
  }, [data]);

  useEffect(() => {
    if (!videoId) {
      logger.error("Couldn't get video id");
      return;
    }
    let userId: string | null = null;
    profileStore
      .get('user.id')
      .then(result => {
        if (result.status === 'ready') {
          userId = result.storeValue;
          runGetNotes(videoId, userId); // run with userId or null
        } else {
          runGetNotes(videoId, userId); // run without user id if store wasn't initialized
        }
      })
      .catch(error => {
        logger.error('Something went wrong while getting userId from storage', error);
        runGetNotes(videoId, userId); // still run if there was ever an issue
      });

    return () => {
      setData(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]); // only care about video id change

  return {
    isError,
    isLoading,
    setNotes,
    dispatchNewNote,
    dispatchReplaceNote,
    dispatchRemoveNote,
    notes,
  };
}
