import type { IconProps } from '@/components/ui/Icon';

export type NoteFormButtonConfig = {
  text: string;
  icon: IconProps['variant'];
};

export type FormState = 'idle' | 'submitting' | 'success' | 'error';

export type NoteFormButtonConfigMap = Record<FormState, NoteFormButtonConfig>;
