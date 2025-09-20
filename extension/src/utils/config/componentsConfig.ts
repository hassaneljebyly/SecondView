import type { NoteFormButtonConfigMap } from '@/types/components';

export const BUTTON_STATES_MAP: NoteFormButtonConfigMap = {
  idle: { text: 'Submit', icon: 'upload' },
  submitting: { text: 'Submitting', icon: 'loading' },
  success: { text: 'Done!', icon: 'check' },
  error: { text: 'Retry', icon: 'error' },
};
