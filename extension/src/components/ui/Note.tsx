import React, { useEffect, useRef, useState, type CSSProperties } from 'react';

import type { NoteResponse } from '@/api/types/notes';
import { useStackedNavigation } from '@/hooks/useStackedNavigation';
import { NOTE_POPUP_DURATION_SECONDS } from '@/utils/config/extensionParams';
import { globalEventSingleton } from '@/utils/lib/events';
import { MISINFO_COLORS, NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';
import {
  formatSecondsToDuration,
  secondsToTimeString,
  timeAgo,
} from '@shared/utils/format/timeStamp';

import Button from './Button';
import Icon from './Icon';
import RemainingTimeDisplay from './RemainingTimeDisplay';
import { useNoteQueue } from '../content/NoteDisplayQueue';
import type { DialogContent } from '../content/NotesOverview';
import Linkify from '../helpers/Linkify';

// TODO(me): 📝 rename note to QueuedNote

export const noteComponentId = 'sv-note';
export default function Note(note: NoteResponse) {
  const { dispatchNavigateForward } = useStackedNavigation();
  const { handleNoteClose, handleNotePromote, noteQueue } = useNoteQueue();

  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const optionsMenuFirstItemRef = useRef<HTMLLIElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const activeNoteRef = useRef<HTMLDivElement>(null);

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
  const noteConfigs = NOTE_CATEGORIES.find(({ value }) => value === misinfoType);
  const optionsMenuState = openOptionsMenu ? 'open' : 'closed';
  const categoryColor = MISINFO_COLORS[noteConfigs!.value];
  const categoryLabel = noteConfigs!.displayName;
  const headerStyle = {
    '--_sv-category-color': categoryColor,
    '--_sv-count-down-duration': `${NOTE_POPUP_DURATION_SECONDS}s`,
  } as CSSProperties;
  const allowRating = !isOwn && !alreadyRated;

  const startTimeString = secondsToTimeString(startTime);
  const endTimeString = secondsToTimeString(endTime);
  const claimDuration = endTime - startTime;
  const claimDurationString = formatSecondsToDuration(claimDuration) + ' long';
  const sourcesString = `${sources.length} source${sources.length > 1 ? 's' : ''} sited`;
  const metaData = `${startTimeString}-${endTimeString} · ${claimDurationString} · ${sourcesString}`;

  function handleOpenNote(e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    e.stopPropagation();
    setOpenNote(true);
    // when a user interacts with the queued note `queueSlot`, it indicates they are
    // no longer interested in the currently active note, so to reflect this, we
    // promote the queued note into the active slot and dismiss the old active note
    handleNotePromote(note);
  }

  function dismissEnterKey(
    e: React.KeyboardEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLParagraphElement>
  ) {
    // If there's a note in queue and Enter is clicked on any button
    // it will open it, this stops that behavior
    if (e.key === 'Enter' && noteQueue[0]) e.stopPropagation();
  }

  useEffect(() => {
    const clickEvent = globalEventSingleton.on('click', e => {
      const { current: optionsMenu } = optionsMenuRef;
      const clickTarget = e.target as Node | null;
      if (optionsMenu && !optionsMenu.contains(clickTarget)) {
        e.stopPropagation();
        setOpenOptionsMenu(false);
      }
    });

    const escapeKeyDownEvent = globalEventSingleton.on('keydown', e => {
      if (e.type !== 'keydown') return;
      const { key } = e as KeyboardEvent;

      // close options menu
      if (key === 'Escape' && openOptionsMenu) {
        e.stopPropagation();
        setOpenOptionsMenu(false);
      }
      // close note
      if (key === 'Escape' && !openOptionsMenu) {
        // but only active one
        const [noteInQueue, activeNote] = noteQueue;
        if (noteInQueue) {
          handleNoteClose(noteInQueue.id);
          return;
        }

        if (activeNote) {
          handleNoteClose(activeNote.id);
          return;
        }
      }
      // open note
      if (key === 'Enter' && !openNote) {
        const { current: activeNote } = activeNoteRef;
        e.stopPropagation();
        setOpenNote(true);
        handleNotePromote(note);
        activeNote?.focus();
      }
    });

    return () => {
      clickEvent.disconnectEvent();
      escapeKeyDownEvent.disconnectEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOptionsMenu, openNote, noteQueue]);

  return (
    <div
      id='sv-note'
      className={`sv-note ${openNote ? 'sv-note--expand' : ''}`}
      tabIndex={openNote ? 0 : -1}
      ref={activeNoteRef}
    >
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
              onKeyDown: dismissEnterKey,
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
        <p className='sv-note__text' onKeyDown={dismissEnterKey} inert={!openNote}>
          <Linkify text={noteText} />
        </p>
        <div className='sv-note__meta'>
          <span className='sv-note__time-stamp'>Posted {timeAgo(createdAt || '')}</span>
          <span className='sv-note__meta-data'>{metaData}</span>
          <button
            className='sv-note__notes-details'
            onClick={() => dispatchNavigateForward('note-details')}
            onKeyDown={dismissEnterKey}
          >
            View note details
          </button>
        </div>
      </div>
      <div className='sv-note__footer'>
        {allowRating && (
          <div className='sv-note__footer-rating-btn-wrapper'>
            <Button
              theme='blue'
              text='Rate It'
              shape='pill'
              noDarkMode
              enableAutoFocus
              disabled={rateLimited}
              actions={{
                onClick: () => {
                  dispatchNavigateForward('note-rating');
                },
                onKeyDown: dismissEnterKey,
              }}
            />
            <RemainingTimeDisplay
              rateLimitKey='rateLimits.ratings.retryAt'
              label='Next vote in:'
              onTimesUp={() => setRateLimited(false)}
              runIfTimeRemainingOnce={() => setRateLimited(true)}
            />
          </div>
        )}
        <div className='sv-note__options-menu-wrapper' ref={optionsMenuRef}>
          <ul
            id='sv-note__options-menu'
            className={`sv-note__options-menu sv-note__options-menu--${optionsMenuState}`}
            inert={!openOptionsMenu}
            aria-hidden={!openOptionsMenu}
          >
            <li
              className='sv-note__options-menu-item'
              ref={optionsMenuFirstItemRef}
              title='Experimental, coming soon'
            >
              <Button disabled text='Edit' icon={{ variant: 'edit', size: 'xs' }} shape='rounded' />
            </li>
            <li className='sv-note__options-menu-item' title='Experimental, coming soon'>
              <Button disabled text='Link note' icon={{ variant: 'link' }} shape='rounded' />
            </li>
            <li
              className='sv-note__options-menu-item'
              data-danger
              title='Experimental, coming soon'
            >
              <Button disabled text='Report' icon={{ variant: 'report' }} shape='rounded' />
            </li>
            <li
              className='sv-note__options-menu-item'
              data-danger
              title='Experimental, coming soon'
            >
              <Button disabled text='Delete' icon={{ variant: 'delete' }} shape='rounded' />
            </li>
          </ul>
          <Button
            theme='light'
            icon={{ variant: 'options' }}
            text='More options'
            iconOnly
            noDarkMode
            aria={{ 'aria-controls': 'sv-note__options-menu', 'aria-expanded': openOptionsMenu }}
            actions={{
              onClick: () => setOpenOptionsMenu(!openOptionsMenu),
              onKeyDown: dismissEnterKey,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function StaticNote({
  note,
  onDialogOpen,
}: {
  note: NoteResponse;
  onDialogOpen: (note: NoteResponse, dialogContentTarget: DialogContent) => void;
}) {
  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const optionsMenuFirstItemRef = useRef<HTMLLIElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const {
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
  const noteConfigs = NOTE_CATEGORIES.find(({ value }) => value === misinfoType);
  const optionsMenuState = openOptionsMenu ? 'open' : 'closed';
  const categoryColor = MISINFO_COLORS[noteConfigs!.value];
  const categoryLabel = noteConfigs!.displayName;
  const headerStyle = {
    '--_sv-category-color': categoryColor,
    '--_sv-count-down-duration': `${NOTE_POPUP_DURATION_SECONDS}s`,
  } as CSSProperties;
  const allowRating = !isOwn && !alreadyRated;

  const startTimeString = secondsToTimeString(startTime);
  const claimDuration = endTime - startTime;
  const claimDurationString = formatSecondsToDuration(claimDuration) + ' long';
  const sourcesString = `${sources.length} source${sources.length > 1 ? 's' : ''} sited`;
  const metaData = `· ${claimDurationString} · ${sourcesString}`;

  function handleSeekToStart() {
    const videoEle = document.querySelector('video');
    if (videoEle) {
      videoEle.currentTime = startTime;
    }
  }

  useEffect(() => {
    const clickEvent = globalEventSingleton.on('click', e => {
      const { current: optionsMenu } = optionsMenuRef;
      const clickTarget = e.target as Node | null;
      if (optionsMenu && !optionsMenu.contains(clickTarget)) {
        e.stopPropagation();
        setOpenOptionsMenu(false);
      }
    });

    const escapeKeyDownEvent = globalEventSingleton.on('keydown', e => {
      if (e.type !== 'keydown') return;
      const { key } = e as KeyboardEvent;

      // close options menu
      if (key === 'Escape' && openOptionsMenu) {
        e.stopPropagation();
        setOpenOptionsMenu(false);
      }
    });

    return () => {
      clickEvent.disconnectEvent();
      escapeKeyDownEvent.disconnectEvent();
    };
  }, [openOptionsMenu]);

  return (
    <div id='sv-note' className='sv-note sv-note--expand' tabIndex={0}>
      <div className='sv-note__header' style={headerStyle}>
        <span className='sv-note-status-icon' data-note-status={status}>
          <Icon variant='badge' size='sm' />
        </span>
        <span className='sv-note__misinfo-category'>{categoryLabel}</span>
      </div>
      <div className='sv-note__main'>
        <p className='sv-note__text'>
          <Linkify text={noteText} />
        </p>
        <div className='sv-note__meta'>
          <span className='sv-note__time-stamp'>Posted {timeAgo(createdAt || '')}</span>
          <span className='sv-note__meta-data'>
            At{' '}
            <button className='sv-note__start-at-btn' onClick={handleSeekToStart}>
              {startTimeString}
            </button>{' '}
            {metaData}
          </span>
          <button
            className='sv-note__notes-details'
            onClick={() => onDialogOpen(note, 'note-details')}
          >
            View note details
          </button>
        </div>
      </div>
      <div className='sv-note__footer'>
        {allowRating && (
          <div className='sv-note__footer-rating-btn-wrapper'>
            <Button
              theme='blue'
              text='Rate It'
              shape='pill'
              noDarkMode
              enableAutoFocus
              disabled={rateLimited}
              actions={{
                onClick: () => {
                  onDialogOpen(note, 'rating');
                },
              }}
            />
            <RemainingTimeDisplay
              rateLimitKey='rateLimits.ratings.retryAt'
              label='Next vote in:'
              onTimesUp={() => setRateLimited(false)}
              runIfTimeRemainingOnce={() => setRateLimited(true)}
            />
          </div>
        )}
        <div className='sv-note__options-menu-wrapper' ref={optionsMenuRef}>
          <ul
            id='sv-note__options-menu'
            className={`sv-note__options-menu sv-note__options-menu--${optionsMenuState}`}
            inert={!openOptionsMenu}
            aria-hidden={!openOptionsMenu}
          >
            <li
              className='sv-note__options-menu-item'
              ref={optionsMenuFirstItemRef}
              title='Experimental, coming soon'
            >
              <Button disabled text='Edit' icon={{ variant: 'edit', size: 'xs' }} shape='rounded' />
            </li>
            <li className='sv-note__options-menu-item' title='Experimental, coming soon'>
              <Button disabled text='Link note' icon={{ variant: 'link' }} shape='rounded' />
            </li>
            <li
              className='sv-note__options-menu-item'
              data-danger
              title='Experimental, coming soon'
            >
              <Button disabled text='Report' icon={{ variant: 'report' }} shape='rounded' />
            </li>
            <li
              className='sv-note__options-menu-item'
              data-danger
              title='Experimental, coming soon'
            >
              <Button disabled text='Delete' icon={{ variant: 'delete' }} shape='rounded' />
            </li>
          </ul>
          <Button
            theme='light'
            icon={{ variant: 'options' }}
            text='More options'
            iconOnly
            noDarkMode
            aria={{ 'aria-controls': 'sv-note__options-menu', 'aria-expanded': openOptionsMenu }}
            actions={{
              onClick: () => setOpenOptionsMenu(!openOptionsMenu),
            }}
          />
        </div>
      </div>
    </div>
  );
}
