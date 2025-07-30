import type { InjectTask } from '@/types';

import NoteForm, { noteFormId } from '.';

export const NoteFormTask: InjectTask = {
  domTargetSelector: 'ytd-player#ytd-player #container',
  rootWrapperId: 'sv-note-form-root',
  componentId: noteFormId,
  component: <NoteForm />,
};
