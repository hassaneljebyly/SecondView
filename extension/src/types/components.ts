import type React from 'react';

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
  | 'ImportFailCard'
  | 'Onboarding';
export type NavigationState = {
  leftWidget: WidgetType[];
  centerWidget: WidgetType;
  rightWidget: WidgetType[];
};
export type NavigationContextValue = {
  navigation: NavigationState;
  setNavigation: React.Dispatch<React.SetStateAction<NavigationState>>;
};
