import type { InjectTask } from '@/types';

import NotesOverview, { notesOverviewId } from '.';

export const NotesOverviewTask: InjectTask = {
  domTargetSelector: '#above-the-fold',
  rootWrapperId: 'sv-notes-overview-wrapper',
  componentId: notesOverviewId,
  component: <NotesOverview />,
};
