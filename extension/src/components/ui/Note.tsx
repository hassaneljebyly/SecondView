import React, { useRef, useState, type CSSProperties } from 'react';

import type { NoteResponse } from '@/api/types/notes';
import { useStackedNavigation } from '@/hooks/useStackedNavigation';
import { NOTE_POPUP_DURATION_SECONDS } from '@/utils/config/extensionParams';
import { NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';
import { secondsToTimeString, timeAgo } from '@shared/utils/format/timeStamp';

import Button from './Button';
import Icon from './Icon';
import { useNoteQueue } from '../content/NoteDisplayQueue';
import Linkify from '../helpers/Linkify';

export const noteComponentId = 'sv-note';
export default function Note(note: NoteResponse) {
  const { dispatchNavigateForward } = useStackedNavigation();
  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const optionsMenuState = openOptionsMenu ? 'open' : 'closed';
  const optionsMenuFirstItemRef = useRef<HTMLLIElement>(null);
  const { handleNoteClose, handleNotePromote } = useNoteQueue();

  const {
    id: noteId,
    noteText,
    misinfoType,
    status,
    isOwn,
    alreadyRated,
    startTime,
    endTime,
    sources,
    createdAt,
  } = note;
  const categoryColor = NOTE_CATEGORIES[misinfoType]['color'];
  const categoryLabel = NOTE_CATEGORIES[misinfoType]['displayName'];
  const headerStyle = {
    '--_sv-category-color': categoryColor,
    '--_sv-count-down-duration': `${NOTE_POPUP_DURATION_SECONDS}s`,
  } as CSSProperties;
  const allowRating = !isOwn && !alreadyRated;

  const startTimeString = secondsToTimeString(startTime);
  const endTimeString = secondsToTimeString(endTime);
  const claimDuration = endTime - startTime;
  const claimDurationString = secondsToTimeString(claimDuration);
  const sourcesString = `${sources.length} source${sources.length > 1 ? 's' : ''} sited`;
  const metaData = `${startTimeString}-${endTimeString} (${claimDurationString}s) · ${sourcesString}`;

  function handleOpenNote(e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    e.stopPropagation();
    setOpenNote(true);
    // when a user interacts with the queued note `queueSlot`, it indicates they are
    // no longer interested in the currently active note, so to reflect this, we
    // promote the queued note into the active slot and dismiss the old active note
    handleNotePromote(note);
  }

  return (
    <div id='sv-note' className={`sv-note ${openNote ? 'sv-note--expand' : ''}`}>
      <div
        className='sv-note__header'
        style={headerStyle}
        onAnimationEnd={e => {
          if (e.animationName === 'countDown') {
            handleNoteClose(noteId);
          }
        }}
      >
        <span className='sv-note-status-icon' data-note-status={status}>
          <Icon variant='badge' size='sm' />
        </span>
        <span className='sv-note__misinfo-category'>{categoryLabel}</span>
        <div className='sv-note__header-action'>
          <Button
            icon={{ variant: 'cancel' }}
            size='xs'
            iconOnly
            text='Close Note'
            noDarkMode
            actions={{
              onClick: () => handleNoteClose(noteId),
            }}
          />
        </div>
      </div>
      <div className='sv-note__main'>
        <button
          className='sv-note__open-note'
          aria-controls='sv-note'
          aria-expanded={openNote}
          onClick={handleOpenNote}
        >
          <span className='sv-sr-only'>Open Note</span>
        </button>
        <p className='sv-note__text'>
          <Linkify text={noteText} />
        </p>
        <div className='sv-note__meta'>
          <span className='sv-note__time-stamp'>Posted {timeAgo(createdAt || '')}</span>
          <span className='sv-note__meta-data'>{metaData}</span>
          <button
            className='sv-note__notes-details'
            onClick={() => dispatchNavigateForward('note-details')}
          >
            View note details
          </button>
        </div>
      </div>
      <div className='sv-note__footer'>
        {allowRating && (
          <Button
            theme='blue'
            text='Rate It'
            shape='pill'
            noDarkMode
            actions={{
              onClick: () => {
                dispatchNavigateForward('note-rating');
              },
            }}
          />
        )}
        <div className='sv-note__options-menu-wrapper'>
          <ul
            id='sv-note__options-menu'
            className={`sv-note__options-menu sv-note__options-menu--${optionsMenuState}`}
            inert={!openOptionsMenu}
            aria-hidden={!openOptionsMenu}
          >
            <li className='sv-note__options-menu-item' ref={optionsMenuFirstItemRef}>
              <Button text='Report' icon={{ variant: 'report' }} shape='rounded' />
            </li>
            <li className='sv-note__options-menu-item'>
              <Button text='Link note' icon={{ variant: 'link' }} shape='rounded' />
            </li>
            <li className='sv-note__options-menu-item'>
              <Button text='Edit' icon={{ variant: 'edit', size: 'xs' }} shape='rounded' />
            </li>
            <li className='sv-note__options-menu-item'>
              <Button text='Delete' icon={{ variant: 'delete' }} shape='rounded' />
            </li>
          </ul>
          <Button
            theme='light'
            icon={{ variant: 'options' }}
            text='More options'
            iconOnly
            noDarkMode
            aria={{ 'aria-controls': 'sv-note__options-menu', 'aria-expanded': openOptionsMenu }}
            actions={{ onClick: () => setOpenOptionsMenu(!openOptionsMenu) }}
          />
        </div>
      </div>
    </div>
  );
}
