import { useEffect, useRef, useState, type MouseEvent } from 'react';

import { autoFocusFirstTab, autoFocusRateItButton } from '@/utils/dom/autoFocus';
import { globalEventSingleton } from '@/utils/lib/events';
import { mockNotesDataResponse } from '@mocks/mockDataConfig';
import type { NotesFromStorage } from '@shared/types/schemas';

import Note from './Note';
import NoteRatingTabs from './NoteRatingTabs';

export type PanelsNames = 'notePanel' | 'ratingPanel';

export const noteBlockId = 'sv-note-wrapper';
export default function NoteBlock() {
  const { noteList } = mockNotesDataResponse;
  const note = noteList[0] as NotesFromStorage;
  const { noteId } = note;
  const [openNote, setOpenNote] = useState(false);
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const [openPanel, setOpenPanel] = useState<PanelsNames>('notePanel');
  const [noteWrapperHight, setNoteWrapperHight] = useState('');
  function handleOpenNote() {
    setOpenNote(true);
  }
  function handleNoteClose(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    // stop propagation so clicking the button doesn't trigger
    //  a click on the header which will open the note
    event.stopPropagation();
    globalEventSingleton.emit('note:close');
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
    <div
      id={noteBlockId}
      className='sv-note-wrapper'
      style={{ height: openPanel === 'ratingPanel' ? noteWrapperHight : '' }}
    >
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
