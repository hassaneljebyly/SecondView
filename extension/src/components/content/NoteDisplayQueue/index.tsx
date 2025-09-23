import { useEffect, useState } from 'react';

import NoteBlock from '@/components/ui/NoteBlock';
import { globalEventSingleton } from '@/utils/lib/events';
import type { NotesFromStorage } from '@shared/types/schemas';

export type QueueType = [NotesFromStorage | null, NotesFromStorage | null];

export const noteDisplayQueueId = 'sv-note-queue';
export default function NoteDisplayQueue() {
  const [noteQueue, setNoteQueue] = useState<QueueType>([null, null]);
  function handleNoteClose(noteId: NotesFromStorage['noteId']) {
    const newNoteQueue = noteQueue.map(note => {
      if (note && note['noteId'] === noteId) {
        return null;
      }
      return note;
    }) as QueueType;

    setNoteQueue(newNoteQueue);
  }
  useEffect(() => {
    const notePromoteQueueEvent = globalEventSingleton.on('note:promoteQueue', e => {
      // `openedNote` is note that was opened and possibly the note
      // that should get promoted to activeSlot
      const { detail: openedNote } = e as CustomEvent<NotesFromStorage>;
      const [, activeSlot] = noteQueue;
      // if there's an active note
      // and note opened is a note in queueSlot
      if (activeSlot && activeSlot['noteId'] !== openedNote['noteId']) {
        setNoteQueue([null, openedNote]);
      }
    });
    const noteCloseEvent = globalEventSingleton.on('note:close', e => {
      const { detail: noteToClose } = e as CustomEvent<NotesFromStorage>;
      handleNoteClose(noteToClose['noteId']);
    });
    const noteDisplayEvent = globalEventSingleton.on('note:show', e => {
      const { detail: dispatchedNote } = e as CustomEvent<NotesFromStorage>;
      setNoteQueue(prev => {
        const [queueSlot, activeSlot] = prev;

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
    });
    return () => {
      noteDisplayEvent.disconnectEvent();
      noteCloseEvent.disconnectEvent();
      notePromoteQueueEvent.disconnectEvent();
    };
  });
  return (
    <ul id={noteDisplayQueueId} className='sv-note-queue'>
      {noteQueue.map((note, i) => {
        // I needed a stable key
        const slotKey = i === 0 ? 'queueSlot' : 'activeSlot';
        if (note) {
          // the key worked but a new note was treated like the old one by react,
          // so slotKey for empty `<li/>` and `noteId` for when `note !== null`
          const { noteId } = note;
          return (
            <li key={noteId}>
              <NoteBlock note={note} />
            </li>
          );
        }
        return <li key={slotKey} />;
      })}
    </ul>
  );
}
