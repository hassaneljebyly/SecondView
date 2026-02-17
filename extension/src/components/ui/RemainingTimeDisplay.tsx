import { useEffect, useState } from 'react';

import { getRemainingTimeFormatted } from '@shared/utils/format/timeStamp';

export function RemainingTimeDisplay({
  retryAfter,
  onTimesUp,
}: {
  retryAfter: string;
  onTimesUp: () => void;
}) {
  const [timeRemaining, setTimeRemaining] = useState(getRemainingTimeFormatted(retryAfter));
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() > new Date(retryAfter).getTime()) {
        clearInterval(interval);
        onTimesUp();
      }
      const timeRemainingFormatted = getRemainingTimeFormatted(retryAfter);
      setTimeRemaining(timeRemainingFormatted);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);
  return (
    <p className='sv-remaining-time'>
      Retry after: {timeRemaining === '0s' ? 'done!' : timeRemaining}
    </p>
  );
}
