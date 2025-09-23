import type { InjectTask } from '@/types';

import NoteSegmentsBar, { noteSegmentsBarId } from '.';

export const NoteSegmentsBarTask: InjectTask = {
  domTargetSelector: '.ytp-progress-bar-container',
  rootWrapperId: 'sv-note-segments-bar-wrapper',
  componentId: noteSegmentsBarId,
  component: <NoteSegmentsBar />,
};
