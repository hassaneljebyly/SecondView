import { FormToggleButtonTask } from '@/components/content/FormToggleButton/injectTask';
import { NoteFormTask } from '@/components/content/NoteForm/injectTask';
import type { InjectTask } from '@/types';

export const INJECT_TASK: InjectTask[] = [FormToggleButtonTask, NoteFormTask];
// {
//   domTargetSelector: '.ytp-progress-bar-container',
//   rootWrapperId: withPrefix('note-display-root'),
//   componentId: withPrefix('segments-list'),
//   component: (
//     <StrictModeWrapper>
//       <NoteSegmentsList />
//     </StrictModeWrapper>
//   ),
// },
// {
//   domTargetSelector: '#player-container:has(#ytd-player)',
//   rootWrapperId: withPrefix('note-popup-root'),
//   componentId: withPrefix('note-popup'),
//   component: (
//     <StrictModeWrapper>
//       <NoteQueuePopUp />
//     </StrictModeWrapper>
//   ),
// },
