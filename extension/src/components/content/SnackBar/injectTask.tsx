import type { InjectTask } from '@/types';

import SnackBar, { snackBarId } from '.';

export const SnackBarTask: InjectTask = {
  domTargetSelector: 'body',
  rootWrapperId: 'sv-snackbar-wrapper',
  componentId: snackBarId,
  component: <SnackBar />,
};
