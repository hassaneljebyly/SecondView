import type { InjectTask } from '@/types';

import FormToggleButton, { formToggleButtonId } from '.';

export const FormToggleButtonTask: InjectTask = {
  domTargetSelector: '#actions',
  rootWrapperId: 'sv-add-note-btn-wrapper',
  componentId: formToggleButtonId,
  component: <FormToggleButton />,
};
