import { FormToggleButtonTask } from '@/components/content/FormToggleButton/injectTask';
import { NoteDisplayQueueTask } from '@/components/content/NoteDisplayQueue/injectTask';
import { NoteFormTask } from '@/components/content/NoteForm/injectTask';
import { NoteSegmentsBarTask } from '@/components/content/NoteSegmentsBar/injectTask';
// import MainPopup from '@/components/popup/ExtensionPopup';
import type { InjectTask } from '@/types';

export const INJECT_TASK: InjectTask[] = [
  FormToggleButtonTask,
  NoteFormTask,
  NoteSegmentsBarTask,
  NoteDisplayQueueTask,
  // uncomment for when testing popup
  // {
  //   domTargetSelector: '#popup-mock',
  //   rootWrapperId: '',
  //   componentId: '',
  //   component: <MainPopup />,
  // },
];
