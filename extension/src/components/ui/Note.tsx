import { useState, type CSSProperties, type MouseEvent } from 'react';

import { globalEventSingleton } from '@/utils/lib/events';
import { mockNotesDataResponse } from '@shared/mocks/mockDataConfig';
import type { NotesFromStorage } from '@shared/types/schemas';
import { NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';

import Button from './Button';
import { Linkify } from './Linkify';

export const noteComponentId = 'sv-note';
export default function Note({ expandable = false }: { expandable?: boolean }) {
  const [openNote, setOpenNote] = useState(false);
  const { noteList } = mockNotesDataResponse;
  const { noteContent, category } = noteList[0] as NotesFromStorage;
  const categoryColor = NOTE_CATEGORIES[category]['color'];
  const categoryLabel = NOTE_CATEGORIES[category]['displayName'];
  const headerStyle = {
    '--_sv-category-color': categoryColor,
  } as CSSProperties;
  function handleNoteClose(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    // stop propagation so clicking the button doesn't trigger
    //  a click on the header which will open the note
    event.stopPropagation();
    globalEventSingleton.emit('note:close');
  }
  return (
    <div className='sv-note__wrapper'>
      <div id={noteComponentId} className='sv-note'>
        <div
          className='sv-note__header sv-divider sv-divider--bottom'
          style={headerStyle}
          role={expandable ? 'button' : 'none'}
          aria-expanded={!expandable || openNote}
          onClick={() => setOpenNote(true)}
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
            <Button text='Rate It' shape='rounded' theme='blue' />
          </div>
        </div>
      </div>
    </div>
  );
}
