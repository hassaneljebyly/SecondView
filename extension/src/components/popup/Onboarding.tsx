import { useEffect } from 'react';

import { generateUserHandler } from '@/api/apiHandlers/user';
import { useNavigation } from '@/hooks/useNavigation';
import useProfile from '@/hooks/useProfile';
import useRequest from '@/hooks/useRequest';
import { profileStore } from '@/utils/lib/storage';

import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';

export default function Onboarding() {
  const { setNavigation, widgetStateClass, isInert } = useNavigation('Onboarding');
  const { data, run, isError, isLoading, setData } = useRequest(generateUserHandler);
  const { profile } = useProfile();
  useEffect(() => {
    if (profile.user.id === null) {
      profileStore.get().then(result => {
        if (result.status === 'ready' && result.storeValue.user.id !== null) {
          setNavigation({
            leftWidget: [],
            centerWidget: 'ProfileOverviewCard',
            rightWidget: ['AccessCredentialsCard', 'ProfileImportCard'],
          });
        }
      });
    }
    if (data) {
      profileStore.set(data, profile);
      setNavigation({
        leftWidget: [],
        centerWidget: 'ProfileOverviewCard',
        rightWidget: ['AccessCredentialsCard', 'ProfileImportCard'],
      });
      setData(null);
    }
    if (isError) {
      console.log('show global error', isError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, profile]); // only data, isError and profile are needed
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
                  leftWidget: ['Onboarding'],
                  centerWidget: 'ProfileImportCard',
                  rightWidget: ['ImportFailCard', 'ImportSuccessCard'],
                }),
            }}
          />
        </div>
      </div>
    </div>
  );
}
