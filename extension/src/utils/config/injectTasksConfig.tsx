import { FormToggleButtonTask } from '@/components/content/FormToggleButton/injectTask';
import { NoteFormTask } from '@/components/content/NoteForm/injectTask';
import { NoteSegmentsBarTask } from '@/components/content/NoteSegmentsBar/injectTask';
import type { InjectTask } from '@/types';

export const INJECT_TASK: InjectTask[] = [FormToggleButtonTask, NoteFormTask, NoteSegmentsBarTask];

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
