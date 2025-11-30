import { useEffect, useRef, type CSSProperties, type MouseEvent, type RefObject } from 'react';

import { NOTE_POPUP_DURATION_SECONDS } from '@/utils/config/extensionParams';
import { globalEventSingleton } from '@/utils/lib/events';
import type { NotesFromStorage } from '@shared/types/schemas';
import { NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';

import Button from './Button';
import type { PanelsNames } from './NoteBlock';
import Linkify from '../helpers/Linkify';

export const noteComponentId = 'sv-note';

export default function Note({
  expandable = false,
  note,
  leftPanelRef,
  openPanel,
  openNote,
  handleOpenRatingPanel,
  onNoteClose,
  onNoteOpen,
}: {
  expandable?: boolean;
  note: NotesFromStorage;
  leftPanelRef: RefObject<HTMLDivElement | null>;
  openPanel: PanelsNames;
  openNote: boolean;
  handleOpenRatingPanel: () => void;
  onNoteClose: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onNoteOpen: () => void;
}) {
  const noteHeaderRef = useRef<HTMLDivElement | null>(null);
  const { noteContent, category } = note;
  const categoryColor = NOTE_CATEGORIES[category]['color'];
  const categoryLabel = NOTE_CATEGORIES[category]['displayName'];
  const headerStyle = {
    '--_sv-category-color': categoryColor,
    '--_sv-count-down-duration': `${NOTE_POPUP_DURATION_SECONDS}s`,
  } as CSSProperties;

  useEffect(() => {
    const { current: noteHeader } = noteHeaderRef;
    if (!noteHeader) return;
    const noteCloseAnimEndEvent = globalEventSingleton.on(
      'animationend',
      () => globalEventSingleton.emit('note:close', window, { detail: note }),
      noteHeader
    );
    return () => {
      noteCloseAnimEndEvent.disconnectEvent();
    };
  });
  return (
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
        onClick={onNoteOpen}
        ref={noteHeaderRef}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onNoteOpen();
          }
        }}
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
            noDarkMode
            actions={{
              onClick: onNoteClose,
            }}
          />
        )}
      </div>
      <div className='sv-note__body' inert={!openNote}>
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
            noDarkMode
          />
        </div>
      </div>
    </div>
  );
}
