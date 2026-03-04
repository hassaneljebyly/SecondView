import type { InjectTask } from '@/types';

import FormToggleButton, { formToggleButtonId } from '.';

export const FormToggleButtonTask: InjectTask = {
  domTargetSelector: '#above-the-fold #top-row #owner',
  rootWrapperId: 'sv-add-note-btn-wrapper',
  componentId: formToggleButtonId,
  component: <FormToggleButton />,
};
