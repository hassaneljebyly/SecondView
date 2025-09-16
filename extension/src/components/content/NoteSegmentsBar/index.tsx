import { useEffect } from 'react';

import { buildNotesMap, getSegmentPercentRange } from '@/utils/lib/helpers';
import { logger } from '@/utils/lib/logger';
import { mockNotesDataResponse } from '@shared/mocks/mockDataConfig';
import { NOTE_CATEGORIES } from '@shared/utils/config/noteConstrainsConfig';

export const noteSegmentsBarId = 'sv-note-segments-bar';
export default function NoteSegmentsBar() {
  const {
    noteList,
    videoMetaData: { videoLength },
  } = mockNotesDataResponse;
  useEffect(() => {
    const video = document.querySelector('video') as HTMLVideoElement | null;
    if (!video) {
      logger.error('Could not locate video element');
      return;
    }

    console.log(buildNotesMap(noteList));
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
