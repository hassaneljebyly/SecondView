import { useEffect, useRef, useState, type MouseEvent } from 'react';

import { autoFocusFirstTab, autoFocusRateItButton } from '@/utils/dom/autoFocus';
import { globalEventSingleton } from '@/utils/lib/events';
import type { NotesFromStorage } from '@shared/types/schemas';

import Note from './Note';
import NoteRatingTabs from './NoteRatingTabs';

export type PanelsNames = 'notePanel' | 'ratingPanel';

export const noteBlockId = 'sv-note-wrapper';
export default function NoteBlock({ note }: { note: NotesFromStorage }) {
  const { noteId } = note;
  const [openNote, setOpenNote] = useState(false);
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const [openPanel, setOpenPanel] = useState<PanelsNames>('notePanel');
  const [noteWrapperHight, setNoteWrapperHight] = useState('');
  function handleOpenNote() {
    setOpenNote(true);
    // when a user interacts with the queued note `queueSlot`, it indicates they are
    // no longer interested in the currently active note, so to reflect this, we
    // promote the queued note into the active slot and dismiss the old active note

    // I implement this as a new event `note:promoteQueue` in the existing
    // event system, this approach avoids importing extra libraries like useContext
    // or prop drilling
    globalEventSingleton.emit('note:promoteQueue', window, { detail: note });
  }
  function handleNoteClose(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    // stop propagation so clicking the button doesn't trigger
    //  a click on the header which will open the note
    event.stopPropagation();
    globalEventSingleton.emit('note:close', window, { detail: note });
  }

  function handleOpenRatingPanel() {
    autoFocusFirstTab();
    setOpenPanel('ratingPanel');
  }
  function handleOpenNotePanel() {
    autoFocusRateItButton();
    setOpenPanel('notePanel');
  }
  useEffect(() => {
    const { current: rightPanel } = rightPanelRef;
    const { current: leftPanel } = leftPanelRef;
    if (rightPanel && leftPanel && openNote) {
      const currentPanel = openPanel === 'notePanel' ? leftPanel : rightPanel;
      const currentPanelHight = getComputedStyle(currentPanel).height;
      setNoteWrapperHight(currentPanelHight);
    }
  }, [openPanel, openNote]);
  return (
    <div id={noteBlockId} className='sv-note-wrapper' style={{ height: noteWrapperHight }}>
      <Note
        expandable
        {...{
          note,
          handleOpenRatingPanel,
          leftPanelRef,
          openPanel,
          openNote,
          onNoteClose: handleNoteClose,
          onNoteOpen: handleOpenNote,
        }}
      />
      <NoteRatingTabs
        noteId={noteId}
        panelRef={rightPanelRef}
        onCancel={handleOpenNotePanel}
        openPanel={openPanel}
      />
    </div>
  );
}
