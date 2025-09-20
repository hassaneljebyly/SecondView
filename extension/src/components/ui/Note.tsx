import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';

import { NOTE_POPUP_DURATION_SECONDS } from '@/utils/config/extensionParams';
import { autoFocusFirstTab, autoFocusRateItButton } from '@/utils/dom/autoFocus';
import { globalEventSingleton } from '@/utils/lib/events';
import { mockNotesDataResponse } from '@shared/mocks/mockDataConfig';
import type { NotesFromStorage } from '@shared/types/schemas';
import { NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';

import Button from './Button';
import Linkify from './Linkify';
import NoteRatingTabs from './NoteRatingTabs';

export const noteComponentId = 'sv-note';

export type PanelsNames = 'notePanel' | 'ratingPanel';
export default function Note({ expandable = false }: { expandable?: boolean }) {
  // note wrapper
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const [openPanel, setOpenPanel] = useState<PanelsNames>('notePanel');
  const [noteWrapperHight, setNoteWrapperHight] = useState('');
  //
  //
  //
  //
  const [openNote, setOpenNote] = useState(false);
  const noteHeaderRef = useRef<HTMLDivElement | null>(null);
  const { noteList } = mockNotesDataResponse;
  const { noteId, noteContent, category } = noteList[0] as NotesFromStorage;
  const categoryColor = NOTE_CATEGORIES[category]['color'];
  const categoryLabel = NOTE_CATEGORIES[category]['displayName'];
  const headerStyle = {
    '--_sv-category-color': categoryColor,
    '--_sv-count-down-duration': `${NOTE_POPUP_DURATION_SECONDS}s`,
  } as CSSProperties;
  function handleNoteClose(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    // stop propagation so clicking the button doesn't trigger
    //  a click on the header which will open the note
    event.stopPropagation();
    globalEventSingleton.emit('note:close');
  }
  useEffect(() => {
    const { current: noteHeader } = noteHeaderRef;
    if (!noteHeader) return;
    const noteCloseAnimEndEvent = globalEventSingleton.on(
      'animationend',
      () => globalEventSingleton.emit('note:close'),
      noteHeader
    );
    return () => {
      noteCloseAnimEndEvent.disconnectEvent();
    };
  });
  //
  //
  //
  //
  // note wrapper
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
    if (rightPanel && leftPanel) {
      const currentPanel = openPanel === 'notePanel' ? leftPanel : rightPanel;
      const currentPanelHight = getComputedStyle(currentPanel).height;
      setNoteWrapperHight(currentPanelHight);
    }
  }, [openPanel]);
  //
  //
  //
  //
  return (
    <div className='sv-note-wrapper' style={{ height: noteWrapperHight }}>
      <div
        id={noteComponentId}
        className='sv-note'
        ref={leftPanelRef}
        aria-hidden={openPanel !== 'notePanel'}
        inert={openPanel !== 'notePanel'}
      >
        <div
          className='sv-note__header sv-divider sv-divider--bottom'
          style={headerStyle}
          role={expandable ? 'button' : 'none'}
          aria-expanded={!expandable || openNote}
          onClick={() => setOpenNote(true)}
          ref={noteHeaderRef}
        >
          <h3 className='sv-note__category'>{categoryLabel}</h3>
          {expandable && (
            <Button
              text='close'
              iconOnly
              size='xs'
              icon={{
                variant: 'cancel',
              }}
              actions={{
                onClick: handleNoteClose,
              }}
            />
          )}
        </div>
        <div className='sv-note__body'>
          <p className='sv-note__text'>
            <Linkify text={noteContent} />
          </p>
          <div className='sv-note__footer sv-divider sv-divider--top'>
            <Button
              text='Rate It'
              shape='pill'
              theme='blue'
              actions={{
                onClick: handleOpenRatingPanel,
              }}
            />
          </div>
        </div>
      </div>
      <NoteRatingTabs
        noteId={noteId}
        panelRef={rightPanelRef}
        onCancel={handleOpenNotePanel}
        openPanel={openPanel}
      />
    </div>
  );
}
