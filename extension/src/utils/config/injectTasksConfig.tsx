import { FormToggleButtonTask } from '@/components/content/FormToggleButton/injectTask';
import { NoteDisplayQueueTask } from '@/components/content/NoteDisplayQueue/injectTask';
import { NoteFormTask } from '@/components/content/NoteForm/injectTask';
import { NoteSegmentsBarTask } from '@/components/content/NoteSegmentsBar/injectTask';
import type { InjectTask } from '@/types';

export const INJECT_TASK: InjectTask[] = [
  FormToggleButtonTask,
  NoteFormTask,
  NoteSegmentsBarTask,
  NoteDisplayQueueTask,
];
