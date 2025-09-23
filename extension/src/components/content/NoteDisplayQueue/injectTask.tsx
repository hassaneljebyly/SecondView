import type { InjectTask } from '@/types';

import NoteDisplayQueue, { noteDisplayQueueId } from '.';

export const NoteDisplayQueueTask: InjectTask = {
  domTargetSelector: '#player-container:has(#ytd-player)',
  rootWrapperId: `${noteDisplayQueueId}-root-wrapper`,
  componentId: noteDisplayQueueId,
  component: <NoteDisplayQueue />,
};
