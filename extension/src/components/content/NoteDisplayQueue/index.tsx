import React, { createContext, useContext, useEffect, useState } from 'react';

import type { NoteResponse } from '@/api/types/notes';
import NoteBlock from '@/components/ui/NoteBlock';
import { globalEventSingleton } from '@/utils/lib/events';

export type QueueType = [NoteResponse | null, NoteResponse | null];

export const noteDisplayQueueId = 'sv-note-queue';
export default function NoteDisplayQueue() {
  return (
    <NoteQueueContextProvider>
      <NoteDisplayQueueContent />
    </NoteQueueContextProvider>
  );
}

function NoteDisplayQueueContent() {
  const { noteQueue } = useNoteQueue();
  return (
    <ul id={noteDisplayQueueId} className='sv-note-queue'>
      {noteQueue.map((note, i) => {
        // I needed a stable key
        const slotKey = i === 0 ? 'queueSlot' : 'activeSlot';
        if (note) {
          // the key worked but a new note was treated like the old one by react,
          // so slotKey for empty `<li/>` and `id` for when `note !== null`
          const { id } = note;
          return (
            <li key={id} className='sv-pop-in-elastic'>
              <NoteBlock note={note} />
            </li>
          );
        }
        return <li key={slotKey} />;
      })}
    </ul>
  );
}

type NoteQueueContextValue = {
  noteQueue: QueueType;
  handleNoteClose: (noteId: NoteResponse['id']) => void;
  handleNotePromote: (openedNote: NoteResponse) => void;
};

const NoteQueueContext = createContext<NoteQueueContextValue | null>(null);

function NoteQueueContextProvider({ children }: { children: React.ReactNode }) {
  const [noteQueue, setNoteQueue] = useState<QueueType>([null, null]);
  function handleNoteClose(noteId: NoteResponse['id']) {
    const newNoteQueue = noteQueue.map(note => {
      if (note && note['id'] === noteId) {
        return null;
      }
      return note;
    }) as QueueType;

    setNoteQueue(newNoteQueue);
  }
  function handleNotePromote(openedNote: NoteResponse) {
    // `openedNote` is note that was opened and possibly the note
    // that should get promoted to activeSlot
    const [, activeSlot] = noteQueue;
    // if there's an active note
    // and note opened is a note in queueSlot
    if (activeSlot && activeSlot['id'] !== openedNote['id']) {
      setNoteQueue([null, openedNote]);
    }
  }

  function handleNoteShowEvent(e: Event) {
    const { detail: dispatchedNote } = e as CustomEvent<NoteResponse>;
    setNoteQueue(prev => {
      const [queueSlot, activeSlot] = prev;
      // prevents duplicates
      if (activeSlot && activeSlot['id'] === dispatchedNote['id']) {
        return prev;
      }
      if (!activeSlot) {
        // queue is empty or active note was closed or auto closed
        //  new note goes into activeSlot
        return [null, dispatchedNote];
      }

      if (!queueSlot) {
        // queue has active note in activeSlot which means
        //  user is still interacting with it
        //  so new note goes into queueSlot
        return [dispatchedNote, activeSlot];
      }

      // queue is full, means user has note in
      // activeSlot open and there is a note in
      // queueSlot(unlikely but just in case),
      // keep activeSlot and add note to queueSlot
      return [dispatchedNote, activeSlot];
    });
  }

  useEffect(() => {
    const noteDisplayEvent = globalEventSingleton.on('note:show', handleNoteShowEvent);
    return () => {
      noteDisplayEvent.disconnectEvent();
    };
  });
  return (
    <NoteQueueContext.Provider
      value={{
        noteQueue,
        handleNoteClose,
        handleNotePromote,
      }}
    >
      {children}
    </NoteQueueContext.Provider>
  );
}

export function useNoteQueue() {
  const noteQueueContext = useContext(NoteQueueContext);

  if (!noteQueueContext) {
    throw new Error('Something went wrong with contextAPI');
  }
  return noteQueueContext;
}
