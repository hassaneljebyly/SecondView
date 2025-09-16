import { useEffect } from 'react';

import { globalEventSingleton } from '@/utils/lib/events';
import { buildNotesMap, getSegmentPercentRange } from '@/utils/lib/helpers';
import { logger } from '@/utils/lib/logger';
import { mockNotesDataResponse } from '@shared/mocks/mockDataConfig';
import type { NotesFromStorage } from '@shared/types/schemas';
import { NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';

export const noteSegmentsBarId = 'sv-note-segments-bar';
export default function NoteSegmentsBar() {
  const {
    noteList,
    videoMetaData: { videoLength },
  } = mockNotesDataResponse;
  /*
  This effect attaches listeners to a <video> element to show time-synced notes.

  Why the Set?
  - The "timeupdate" event fires many times per second (not once per second).
  - Without deduplication, the same note would be displayed repeatedly.
  - We use a Set (`seenNotes`) to guarantee each note is only shown once as playback moves forward.

  Why the seek handler?
  - If the user seeks backwards, notes that were already marked as "seen" will not be displayed again.
  - To fix this, we listen for the "seeked" event and remove from the Set any notes whose endTime
    is still ahead of the new current playback position.
  - This way, notes can be displayed again if the user rewinds past their endTime.

  In short:
  - `timeupdate` + Set = avoid duplicate note triggers.
  - `seeked` handler = allow notes to reappear if the user goes backwards.
*/

  useEffect(() => {
    const video = document.querySelector('video') as HTMLVideoElement | null;
    if (!video) {
      logger.error('Could not locate video element');
      return;
    }
    const notesMap = buildNotesMap(noteList);
    // track which notes we've already displayed Important because
    // timeupdate fires many times per second (not just once),
    // so without this Set the same note would be triggered repeatedly.
    const seenNotes = new Set<NotesFromStorage>();
    // fired continuously as the video's playback time updates
    function handleTimeUpdate() {
      const currentPlayTime = Math.floor(video!.currentTime);
      const currentNote = notesMap.get(currentPlayTime);
      // show the note only if
      // - there is a note at this timestamp, and
      // - it hasn't already been shown during this play through
      if (currentNote !== undefined && !seenNotes.has(currentNote)) {
        globalEventSingleton.emit('note:show', window, { detail: currentNote });
        // Mark this note as "seen" so it won't fire again while moving forward
        seenNotes.add(currentNote);
      }
    }
    // fired when the user seeks jumps to a different time in the video using seeked event
    function handleUnSeeNote() {
      if (seenNotes.size) {
        const currentTime = Math.floor(video!.currentTime);
        // if the user has jumped backward, allow notes whose endTimeSeconds
        // is still ahead of the new current time to be shown again
        seenNotes.forEach(note => {
          if (currentTime <= note['endTimeSeconds']) seenNotes.delete(note);
        });
      }
    }
    const updateVideoTimeEvent = globalEventSingleton.on('timeupdate', handleTimeUpdate, video);
    const seekVideoTimeEvent = globalEventSingleton.on('seeked', handleUnSeeNote, video);
    return () => {
      updateVideoTimeEvent.disconnectEvent();
      seekVideoTimeEvent.disconnectEvent();
    };
  });
  return (
    <ul id={noteSegmentsBarId} className='sv-segments-list'>
      {noteList.map(({ noteId, category, startTimeSeconds, endTimeSeconds }) => {
        const segmentColor = NOTE_CATEGORIES[category]['color'];
        const { segmentWidth, segmentLeftPos } = getSegmentPercentRange({
          videoLength,
          startTime: startTimeSeconds,
          endTime: endTimeSeconds,
        });
        return (
          <li
            className='sv-segments-list__segment'
            key={noteId}
            style={{
              width: segmentWidth,
              left: segmentLeftPos,
              background: `linear-gradient(to top, ${segmentColor} 40%, transparent 100%)`,
            }}
          />
        );
      })}
    </ul>
  );
}
