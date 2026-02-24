import { useEffect } from 'react';

import { generateUserHandler } from '@/api/apiHandlers/user';
import { useNavigation } from '@/hooks/useNavigation';
import useProfile from '@/hooks/useProfile';
import useRequest from '@/hooks/useRequest';
import type { ShowSnackBarEvent } from '@/utils/config/customEventsConfig';
import { globalEventSingleton } from '@/utils/lib/events';
import { logger } from '@/utils/lib/logger';
import { profileStore } from '@/utils/lib/storage';

import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';

export default function Onboarding() {
  const { setNavigation, widgetStateClass, isInert } = useNavigation('Onboarding');
  const { successResponse, run, isError, isLoading, setSuccessResponse } =
    useRequest(generateUserHandler);
  const { profile } = useProfile();
  useEffect(() => {
    if (profile.user.id === null) {
      profileStore.get().then(result => {
        if (result.status === 'ready' && result.storeValue.user.id !== null) {
          setNavigation({
            leftWidget: ['Onboarding'],
            centerWidget: 'ProfileOverviewCard',
            rightWidget: ['AccessCredentialsCard', 'ProfileImportCard'],
          });
        }
      });
    }
    if (successResponse) {
      profileStore.update('user', oldUser => ({ ...oldUser, ...successResponse.data.user }));
      setNavigation({
        leftWidget: ['Onboarding'],
        centerWidget: 'ProfileOverviewCard',
        rightWidget: ['AccessCredentialsCard', 'ProfileImportCard'],
      });
      setSuccessResponse(null);
    }
    if (isError) {
      logger.error(isError);
      globalEventSingleton.emit('snackBar:show', window, {
        detail: { text: isError.message, status: 'error' } as ShowSnackBarEvent,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successResponse, isError, profile]); // only data, isError and profile are needed
  return (
    <div className='sv-popup-widget__inner-container' inert={isInert}>
      <div
        className={`sv-popup-widget ${widgetStateClass} sv-popup-widget--onboarding sv-onboarding`}
      >
        <div
          className='sv-popup-widget__section sv-popup-widget__section--onboarding-banner'
          aria-hidden
        >
          <p className='sv-popup-widget__section-title'>SecondView</p>
          <img src='https://i.imgur.com/4Z26njF.png' alt='' />
        </div>
        <div className='sv-popup-widget__section '>
          <p className='sv-popup-widget__hint'>
            See notes from viewers clarifying misleading claims or providing context.
            <br />
            <br />
            Browse freely without a profile or create one to add a second view, improve media
            literacy, and help others understand what they’re watching.
          </p>
        </div>
        <div className='sv-popup-widget__section sv-popup-widget__section--onboarding-buttons'>
          {isError && <ErrorMessage errorMessage={isError.message} id='hello' global />}
          <Button
            text='Generate Profile'
            shape='rounded'
            theme='dark'
            icon={{
              variant: isLoading ? 'loading' : 'newUser',
            }}
            actions={{
              onClick: run,
            }}
          />
          <Button
            text='Import Existing Profile '
            shape='rounded'
            icon={{
              variant: 'login',
            }}
            actions={{
              onClick: () =>
                setNavigation({
                  leftWidget: ['Onboarding', 'ProfileOverviewCard'],
                  centerWidget: 'ProfileImportCard',
                  rightWidget: ['ImportSuccessCard'],
                }),
            }}
          />
        </div>
      </div>
    </div>
  );
}
