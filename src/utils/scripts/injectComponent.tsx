import { createRoot} from 'react-dom/client';

import StrictModeWrapper from '@/components/helpers/StrictModeWrapper';
import type { InjectComponentResult, InjectTask } from '@/types';

import { MAX_ATTEMPTS, MOUNTED_ROOTS } from '../config/componentInjectConfig';
import { getOrCreateRootWrapper } from '../dom/injectUtils';
import { logger } from '../lib/logger';


export default function injectComponent(
  task: InjectTask,
  attempts: number = 0
): InjectComponentResult {
  const { domTargetSelector, rootWrapperId, componentId, component } = task;
  // component already in the dom
  if (document.getElementById(componentId)) {
    return {
      success: true,
    };
  }

  const rootWrapper = getOrCreateRootWrapper(rootWrapperId, domTargetSelector);
  // polling the DOM until root wrapper is found
  if (rootWrapper) {
    // data-sv-root used for css reset and global styles
    rootWrapper.setAttribute('data-sv-root', '');
    // mount the react component into the wrapper
    const root = createRoot(rootWrapper);
    MOUNTED_ROOTS.set(rootWrapperId, root);
    root.render(<StrictModeWrapper>{component}</StrictModeWrapper>);
    return {
      success: true,
    };
  }
  // retry polling until MAX_ATTEMPTS is reached
  if (attempts < MAX_ATTEMPTS) {
    return {
      success: false,
      retryTask: task,
      attempts: attempts + 1,
    };
  }
  logger.error(`MAX attempts reached for node of id: ${componentId}`);
  return {
    maxAttemptsReached: true,
  };
}
