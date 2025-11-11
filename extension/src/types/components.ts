import type { IconProps } from '@/components/ui/Icon';

export type NoteFormButtonConfig = {
  text: string;
  icon: IconProps['variant'];
};

export type FormState = 'idle' | 'submitting' | 'success' | 'error';

export type NoteFormButtonConfigMap = Record<FormState, NoteFormButtonConfig>;

export type WidgetType =
  | 'ProfileOverviewCard'
  | 'AccessCredentialsCard'
  | 'ProfileImportCard'
  | 'ImportSuccessCard'
  | 'ImportFailCard';
export type NavigationState = {
  leftWidget: WidgetType[];
  centerWidget: WidgetType;
  rightWidget: WidgetType[];
};
export type NavigationContextValue = {
  navigation: NavigationState;
  handleNavigation: (args: NavigationState) => void;
};
