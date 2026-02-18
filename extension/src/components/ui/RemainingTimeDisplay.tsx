import { useEffect, useRef, useState } from 'react';

import type { Profile } from '@/types/storage';
import { profileStore } from '@/utils/lib/storage';
import type { NestedKeyOf } from '@shared/types/helpers';
import { getRemainingTimeFormatted } from '@shared/utils/format/timeStamp';

type RateLimitKey = `rateLimits.${Exclude<
  NestedKeyOf<Profile['rateLimits']>,
  'notes' | 'ratings' | 'syncProfile'
>}`;

export default function RemainingTimeDisplay({
  rateLimitKey,
  label,
  onTimesUp,
  runIfTimeRemainingOnce,
}: {
  rateLimitKey: RateLimitKey;
  label: string;
  onTimesUp: () => void;
  runIfTimeRemainingOnce: () => void;
}) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const hasRunOnceRef = useRef(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;

    const startTimer = (retryAt: string) => {
      if (!retryAt) return;

      const retryTime = new Date(retryAt).getTime();

      const updateTime = () => {
        const now = Date.now();

        if (now > retryTime) {
          // Time is up
          clearInterval(intervalId);
          timeoutId = setTimeout(() => {
            setTimeRemaining('');
            profileStore.update(rateLimitKey, () => null);
          }, 1000);
          setTimeRemaining('done!');
          if (typeof onTimesUp === 'function') onTimesUp();
          return;
        }

        if (!hasRunOnceRef.current && typeof runIfTimeRemainingOnce === 'function') {
          runIfTimeRemainingOnce();
          hasRunOnceRef.current = true;
        }

        const formatted = getRemainingTimeFormatted(retryAt);
        setTimeRemaining(formatted);
      };

      updateTime();
      intervalId = setInterval(updateTime, 1000);
    };

    // initial load
    profileStore.get(rateLimitKey).then(result => {
      if (result.status === 'ready') {
        const storedRetryAt = result.storeValue;

        if (storedRetryAt && Date.now() < new Date(storedRetryAt).getTime()) {
          // @ts-expect-error started complaining after adding rateLimitKey, don't worry about it
          startTimer(storedRetryAt);
        }
      }
    });

    const removeOnChangeEvent = profileStore.onChange(rateLimitKey, (_, newVal) => {
      if (newVal) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        hasRunOnceRef.current = false;
        // @ts-expect-error started complaining after adding rateLimitKey, don't worry about it
        startTimer(newVal);
      }
    });

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      removeOnChangeEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <p className='sv-remaining-time' aria-hidden={!timeRemaining.length}>
      {`${label} ${timeRemaining}`}
    </p>
  );
}
