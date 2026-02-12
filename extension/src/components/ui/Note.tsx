import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type RefObject,
} from 'react';

import type { InjectTask } from '@/types';

import type { NoteResponse } from '@/api/types/notes';
import { NOTE_POPUP_DURATION_SECONDS } from '@/utils/config/extensionParams';
import { globalEventSingleton } from '@/utils/lib/events';
import { NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';

import Button from './Button';
import type { PanelsNames } from './NoteBlock';
import Linkify from '../helpers/Linkify';
import Icon from './Icon';

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
  note: NoteResponse;
  leftPanelRef: RefObject<HTMLDivElement | null>;
  openPanel: PanelsNames;
  openNote: boolean;
  handleOpenRatingPanel: () => void;
  onNoteClose: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  onNoteOpen: () => void;
}) {
  const noteHeaderRef = useRef<HTMLDivElement | null>(null);
  const { noteText, misinfoType, status, isOwn, alreadyRated } = note;
  const categoryColor = NOTE_CATEGORIES[misinfoType]['color'];
  const categoryLabel = NOTE_CATEGORIES[misinfoType]['displayName'];
  const headerStyle = {
    '--_sv-category-color': categoryColor,
    '--_sv-count-down-duration': `${NOTE_POPUP_DURATION_SECONDS}s`,
  } as CSSProperties;
  const allowRating = !isOwn && !alreadyRated;
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
        <h3 className='sv-note__category'>
          {categoryLabel}
          {' — '}
          <span className={`sv-note__status sv-note__status--${status}`}>{`(${status})`}</span>
        </h3>
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
          <Linkify text={noteText} />
        </p>
        {allowRating && (
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
        )}
      </div>
    </div>
  );
}

export function NoteNew() {
  const [openOptionsMenu, setOpenOptionsMenu] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const optionsMenuState = openOptionsMenu ? 'open' : 'closed';
  const optionsMenuFirstItemRef = useRef<HTMLLIElement>(null);

  return (
    <div id='sv-note' className={`sv-note ${openNote ? 'sv-note--expand' : ''}`}>
      <div className='sv-note__header'>
        <span className='sv-note-status-icon' data-note-status='pending'>
          <Icon variant='badge' size='sm' />
        </span>
        <span className='sv-note__misinfo-category'>False Claim</span>
        <div className='sv-note__header-action'>
          <Button icon={{ variant: 'cancel' }} size='xs' iconOnly text='Close Note' noDarkMode />
        </div>
      </div>
      <div className='sv-note__main'>
        <button
          className='sv-note__open-note'
          aria-controls='sv-note'
          aria-expanded={openNote}
          onClick={() => setOpenNote(true)}
        >
          <span className='sv-sr-only'>Open Note</span>
        </button>
        <p className='sv-note__text'>
          <Linkify
            text={`Rogan cited a Washington Post article about Emily Judd's climate study but omitted key
          context. While the study found 50 million years of cooling, that ended ~300,000 years ago.
          The study's actual conclusion: https://github.com/hassaneljebyly/projects current warming is faster than any period in the past 485
          million years. Judd told WaPo: "what we're doing now is unprecedented" like "a massive
          asteroid hitting Earth."`}
          />
        </p>
        <div className='sv-note__meta'>
          <span className='sv-note__time-stamp'>Posted 2 hours ago</span>
          <span className='sv-note__meta-data'>0:10–1:30 (80s) · 2 sources sited</span>
          <button className='sv-note__notes-details'>View note details</button>
        </div>
      </div>
      <div className='sv-note__footer'>
        <Button theme='blue' text='Rate It' shape='pill' noDarkMode />
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

function NoteDetails() {
  return (
    <div className='sv-note-details'>
      <div className='sv-note-details__header'>
        <button className='sv-note-details__back-btn'>
          <Icon variant='back' />
          <span className='sv-sr-only'>Back to note</span>
        </button>
        <span className='sv-note-details__header-text'>Note details</span>
      </div>

      <div className='sv-note-details__main'>
        <div className='sv-note-details__verdict'>
          <span className='sv-note-status-icon' aria-hidden='true' data-note-status='pending'>
            <Icon variant='badge' size='sm' />
          </span>
          <span className='sv-note-details__verdict-status'>Currently rated accurate</span>
          <p className='sv-note-details__verdict-confidence'>
            Consensus confidence: <span className='sv-note-details__data'>High (87%)</span>
          </p>
          <p className='sv-note-details__verdict-accurate-votes'>
            Accurate: <span className='sv-note-details__data'>8</span>
          </p>
          <p className='sv-note-details__verdict-inaccurate-votes'>
            Inaccurate: <span className='sv-note-details__data'>15</span>
          </p>
        </div>
        <div className='sv-note-details__user-vote'>
          <p className='sv-note-details__user-vote-text'>
            Your vote: <span className='sv-note-details__data'>Accurate</span>— based on clear
            explanation, reliable sources, and neutral tone.
          </p>
        </div>
        <div className='sv-note-details__community-consensus'>
          <p>Community Consensus:</p>
          <ul className='sv-note-details__dimension-distribution'>
            <li>
              <span className='sv-note-details__data'>Evidence</span>
              <span className='sv-note-details__distribution-bar'>
                <span style={{ width: '78%' }} />
              </span>
              <span className='sv-note-details__data'>78%</span>
            </li>
            <li>
              <span className='sv-note-details__data'>Explanation</span>
              <span className='sv-note-details__distribution-bar'>
                <span style={{ width: '31%' }} />
              </span>
              <span className='sv-note-details__data'>31%</span>
            </li>
            <li>
              <span className='sv-note-details__data'>Coverage</span>
              <span className='sv-note-details__distribution-bar'>
                <span style={{ width: '48%' }} />
              </span>
              <span className='sv-note-details__data'>48%</span>
            </li>
            <li>
              <span className='sv-note-details__data'>Tone & Quality</span>
              <span className='sv-note-details__distribution-bar'>
                <span style={{ width: '25%' }} />
              </span>
              <span className='sv-note-details__data'>25%</span>
            </li>
          </ul>
          <p>Top reasons:</p>
          <ul className='sv-note-details__top-reasons'>
            <li>
              <span className='sv-note-details__data'>Clear explanation (12)</span>
            </li>
            <li>
              <span className='sv-note-details__data'>Reliable sources (8)</span>
            </li>
            <li>
              <span className='sv-note-details__data'>Neutral tone (7)</span>
            </li>
          </ul>
        </div>
        <div className='sv-note-details__author-info'>
          <p>
            Author: <span className='sv-note-details__data'>FierceCaptain_1590e3</span>
          </p>
          <p>
            Note created at: <span className='sv-note-details__data'>Wed Feb 11 2026 18:35:37</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export const NoteNewTask: InjectTask = {
  domTargetSelector: 'body',
  rootWrapperId: 'sv-note-wrapper',
  componentId: noteComponentId + 'new',
  component: (
    <>
      <NoteNew /> <NoteDetails />
    </>
  ),
};
