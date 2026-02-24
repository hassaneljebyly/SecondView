import { useEffect, useRef, useState } from 'react';

import Button from '@/components/ui/Button';
import type { ShowSnackBarEvent } from '@/utils/config/customEventsConfig';
import { globalEventSingleton } from '@/utils/lib/events';
import { logger } from '@/utils/lib/logger';

// reference https://m3.material.io/components/snackbar/specs

const TIME_TO_AUTO_HIDE_SNACKBAR = 5000;
export const snackBarId = 'sv-snackbar';
export default function SnackBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState('');
  const [snackActionLabel, setSnackActionLabel] = useState('Action');
  const [snackBarStatus, setSnackBarStatus] = useState<ShowSnackBarEvent['status']>('default');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const snackbarActionRef = useRef<null | (() => void)>(null);

  const snackBarClass = isVisible ? 'sv-animation-pop-in' : 'sv-animation-pop-in-initial';
  const actionEnabled = typeof snackbarActionRef.current === 'function';

  function clearAutoHideTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function startAutoHideTimeout() {
    clearAutoHideTimeout();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, TIME_TO_AUTO_HIDE_SNACKBAR);
  }

  function hideSnackBar() {
    snackbarActionRef.current = null;
    setIsVisible(false);
  }

  function runSnackBarAction() {
    if (typeof snackbarActionRef.current === 'function') {
      snackbarActionRef.current();
      hideSnackBar();
      setSnackBarText('');
    } else logger.error("Couldn't run snackbar action");
  }
  useEffect(() => {
    const showSnackBarEvent = globalEventSingleton.on('snackBar:show', e => {
      const {
        detail: { text, action, actionLabel, status },
      } = e as CustomEvent<ShowSnackBarEvent>;

      if (typeof action === 'function') {
        snackbarActionRef.current = action;
        if (actionLabel) setSnackActionLabel(actionLabel);
      }
      // skip default
      if (status && status !== 'default') setSnackBarStatus(status);
      setSnackBarText(text);
      setIsVisible(true);
    });

    return () => {
      showSnackBarEvent.disconnectEvent();
    };
  }, []);
  useEffect(() => {
    if (isVisible) {
      startAutoHideTimeout();
    } else {
      clearAutoHideTimeout();
    }

    return clearAutoHideTimeout;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]); // only care about isVisible, also avoids changing of text and action function when now event is dispatched
  // TODO(me): 📝 maybe add stacked snackbar later later

  return (
    <div
      id={snackBarId}
      className={`sv-snackbar ${snackBarClass} sv-snackbar--${snackBarStatus}`}
      onMouseEnter={clearAutoHideTimeout}
      onMouseLeave={() => {
        if (isVisible) startAutoHideTimeout();
      }}
    >
      <p className='sv-snackbar__text'>{snackBarText}</p>

      <div className='sv-snackbar__controls'>
        {actionEnabled && (
          <div className='sv-snackbar__action'>
            <Button
              text={snackActionLabel}
              noDarkMode
              theme='light'
              shape='rounded'
              actions={{ onClick: runSnackBarAction }}
            />
          </div>
        )}

        <div className='sv-snackbar__close'>
          <Button
            text='close notification'
            icon={{ variant: 'cancel', size: 'xs' }}
            iconOnly
            noDarkMode
            actions={{ onClick: hideSnackBar }}
          />
        </div>
      </div>
    </div>
  );
}
