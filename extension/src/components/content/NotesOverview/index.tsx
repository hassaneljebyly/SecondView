import { useEffect, useRef, useState } from 'react';

import type { NoteResponse } from '@/api/types/notes';
import { StaticNote } from '@/components/ui/Note';
import { NoteDetailsBlock } from '@/components/ui/NoteDetails';
import { NoteTabsBlock } from '@/components/ui/NoteRatingTabs';
import useNotes from '@/hooks/useNotes';
import { IS_DEV } from '@/utils/config/loggerConfig';
import { getYouTubeId } from '@/utils/dom/youtube';
import { globalEventSingleton } from '@/utils/lib/events';
import { tempVideoId } from '@shared/mocks/youtube';

export type DialogContent = 'rating' | 'note-details';

export const notesOverviewId = 'sv-notes-overview';

export default function NotesOverview() {
  const currentYoutubeVideoId: string | null =
    (IS_DEV ? tempVideoId : getYouTubeId(window.location.href)) || null;
  const { notes } = useNotes(currentYoutubeVideoId);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [currentNote, setCurrentNote] = useState<NoteResponse | null>(null);
  const [modelTargetContent, setModelTargetContent] = useState<DialogContent | null>(null);
  const [accordionExpand, setAccordionExpand] = useState(false);

  const headerText = notes.length
    ? `Viewers added context they thought was important (${notes.length} note${notes.length > 1 ? 's' : ''})`
    : 'No context has been added to this video yet. Be the first to share what you noticed.';

  function handleDialogOpen(note: NoteResponse, dialogContentTarget: DialogContent) {
    const { current: dialog } = dialogRef;
    if (dialog) {
      dialog.showModal();
      setCurrentNote(note);
      setModelTargetContent(dialogContentTarget);
    }
  }
  function handleDialogClose() {
    const { current: dialog } = dialogRef;
    if (dialog) {
      setCurrentNote(null);
      setModelTargetContent(null);
      dialog.close();
    }
  }

  useEffect(() => {
    const clickOutsideDialogEvent = globalEventSingleton.on('click', e => {
      const { current: dialog } = dialogRef;
      const clickTarget = e.target as Node | null;
      if (dialog && clickTarget && clickTarget.nodeName.toLowerCase() === 'html' && dialog.open) {
        handleDialogClose();
      }
    });

    return () => {
      clickOutsideDialogEvent.disconnectEvent();
    };
  }, []);

  return (
    <div id={notesOverviewId} className='sv-notes-overview'>
      <dialog className='sv-dialog' ref={dialogRef} open={false}>
        {currentNote && modelTargetContent === 'rating' && (
          <NoteTabsBlock note={currentNote} onModelClose={handleDialogClose} />
        )}
        {currentNote && modelTargetContent === 'note-details' && (
          <NoteDetailsBlock note={currentNote} onModelClose={handleDialogClose} />
        )}
      </dialog>
      <div className='sv-accordion'>
        <h3>
          <button
            id='sv-accordion-btn'
            className='sv-accordion__header'
            aria-expanded={accordionExpand}
            aria-controls='sv-accordion__inner'
            onClick={() => setAccordionExpand(!accordionExpand)}
          >
            <span className='sv-accordion__header-text'>{headerText}</span>
          </button>
        </h3>
        <div className='sv-accordion__content'>
          <div
            id='sv-accordion__inner'
            className='sv-accordion__inner'
            role='region'
            aria-labelledby='accordion1id'
            inert={!accordionExpand}
          >
            <ul className='sv-notes-overview__list'>
              {notes.map(noteItem => {
                return (
                  <li key={noteItem.id} className='sv-notes-overview__note-item'>
                    {/* <NoteBlock staticNote note={noteItem} /> */}
                    <StaticNote note={noteItem} onDialogOpen={handleDialogOpen} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
