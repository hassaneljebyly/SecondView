import { useEffect, useState } from 'react';

import { importProfileHandler } from '@/api/apiHandlers/user';
import { useNavigation } from '@/hooks/useNavigation';
import useProfile from '@/hooks/useProfile';
import useRequest from '@/hooks/useRequest';
import type { ShowSnackBarEvent } from '@/utils/config/customEventsConfig';
import { globalEventSingleton } from '@/utils/lib/events';
import { logger } from '@/utils/lib/logger';
import { validateSyncCredentials } from '@shared/utils/validation/helpers';

import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import Icon from '../ui/Icon';
import RemainingTimeDisplay from '../ui/RemainingTimeDisplay';

export default function ProfileImportCard() {
  const [usernameInput, setUsernameInput] = useState('');
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [errors, setErrors] = useState<ReturnType<typeof validateSyncCredentials>>({});
  const [attemptsLeft, setAttemptsLeft] = useState(Infinity);
  const [rateLimited, setRateLimited] = useState(false);
  const { setNavigation, widgetStateClass, isInert } = useNavigation('ProfileImportCard');
  const {
    data,
    run: runImportProfileHandler,
    isError,
    isLoading,
  } = useRequest(importProfileHandler);
  const {
    profile: {
      user: { username, accessKey },
    },
    update,
    pick,
  } = useProfile();

  function handleImportProfileSubmit() {
    try {
      if (username === usernameInput && accessKey === accessKeyInput) {
        setNavigation({
          leftWidget: [],
          centerWidget: 'ProfileOverviewCard',
          rightWidget: ['ProfileImportCard'],
        });
        return;
      }
      const validateSyncCredentialsResult = validateSyncCredentials({
        username: usernameInput,
        accessKey: accessKeyInput,
      });

      if (Object.keys(validateSyncCredentialsResult).length) {
        setErrors(validateSyncCredentialsResult);
      } else {
        setAttemptsLeft(Infinity);
        setErrors({});
        runImportProfileHandler({
          username: usernameInput,
          accessKey: accessKeyInput,
        });
      }
    } catch (error) {
      logger.error(error);
      globalEventSingleton.emit('snackBar:show', window, {
        detail: { text: 'Something went wrong, try again', status: 'error' } as ShowSnackBarEvent,
      });
    }
  }

  useEffect(() => {
    if (data && !isError) {
      update('user', () => ({ ...data.data.user, accessKey: accessKeyInput }));
      setAttemptsLeft(Infinity);
      setErrors({});
      setAccessKeyInput('');
      setUsernameInput('');
      setNavigation({
        leftWidget: ['ProfileImportCard', 'ProfileOverviewCard'],
        centerWidget: 'ImportSuccessCard',
        rightWidget: [],
      });
    }
    if (isError) {
      const { code, meta, message } = isError;
      if (code === 'BAD_REQUEST_VALIDATION_FAILED') {
        if (meta && meta['validationResults']) {
          const validationErrors = meta['validationResults'] as ReturnType<
            typeof validateSyncCredentials
          >;
          setErrors({
            username: validationErrors['username'] || '',
            accessKey: validationErrors['accessKey'] || '',
          });

          if (meta['attemptsLeft'] !== undefined) {
            setAttemptsLeft(meta['attemptsLeft'] as number);
            update('rateLimits.syncProfile.attemptsLeft', () => meta['attemptsLeft'] as number);
          }
        }
      } else if (code === 'INVALID_SYNC_CREDENTIALS') {
        setErrors({ accessKey: message, username: message });

        if (meta && meta['attemptsLeft'] !== undefined) {
          setAttemptsLeft(meta['attemptsLeft'] as number);
          update('rateLimits.syncProfile.attemptsLeft', () => meta['attemptsLeft'] as number);
        }
      } else if (code === 'AUTH_RATE_LIMIT_EXCEEDED') {
        if (meta && meta['retryAt']) {
          setAttemptsLeft(Infinity);
          update('rateLimits.syncProfile.retryAt', () => meta['retryAt'] as string);
        }
      } else {
        logger.error(errors);
        globalEventSingleton.emit('snackBar:show', window, {
          detail: { text: message, status: 'error' } as ShowSnackBarEvent,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError]);
  useEffect(() => {
    const { attemptsLeft: storedAttemptsLeft } = pick('rateLimits.syncProfile');

    if (storedAttemptsLeft !== null) {
      setAttemptsLeft(storedAttemptsLeft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='sv-popup-widget__inner-container' inert={isInert}>
      <div
        className={`sv-popup-widget ${widgetStateClass} sv-popup-widget--profile-import sv-profile-import`}
      >
        <div className='sv-popup-widget__section sv-popup-widget__section--header sv-divider sv-divider--bottom'>
          <Icon variant='login' />
          <p className='sv-popup-widget__section-title'>Use Existing Profile</p>
        </div>
        <div className='sv-popup-widget__section'>
          <p className='sv-popup-widget__hint'>
            Enter credentials from your other device (tap Access Key):
          </p>
          <label
            htmlFor='sv-username-editable'
            className='sv-popup-widget__section-title sv-profile-import__labels'
          >
            Username:
          </label>
          <div className='sv-profile-import__input-container'>
            <input
              id='sv-username-editable'
              className='sv-input'
              value={usernameInput}
              onChange={e => setUsernameInput(e.target.value)}
              placeholder='DarthVaper_deadb0'
              aria-invalid={!!errors['username']}
              disabled={rateLimited}
              autoComplete='off'
            />
            <ErrorMessage id='sv-username-editable' errorMessage={errors['username'] ?? ''} />
          </div>
          <label
            htmlFor='sv-access-key-editable'
            className='sv-popup-widget__section-title sv-profile-import__labels'
          >
            Access Key:
          </label>
          <div className='sv-profile-import__input-container'>
            <input
              id='sv-access-key-editable'
              className='sv-input'
              placeholder='xxxx-xxxx-xxxx-xxxx-xxxx'
              value={accessKeyInput}
              type='password'
              onChange={e => setAccessKeyInput(e.target.value)}
              aria-invalid={!!errors['accessKey']}
              disabled={rateLimited}
              autoComplete='off'
            />
            <ErrorMessage id='sv-access-key-editable' errorMessage={errors['accessKey'] ?? ''} />
            {!isFinite(attemptsLeft) ? (
              <RemainingTimeDisplay
                rateLimitKey='rateLimits.syncProfile.retryAt'
                label='Retry after:'
                onTimesUp={() => setRateLimited(false)}
                runIfTimeRemainingOnce={() => setRateLimited(true)}
              />
            ) : (
              <p className='sv-auth-status' aria-hidden={!isFinite(attemptsLeft)}>
                Attempts left: {attemptsLeft}
              </p>
            )}
          </div>
          {username && (
            <div className='sv-reminders'>
              <Icon variant='error' />
              <p>
                You have a profile: {username}. Importing will permanently replace it. Unsaved
                credentials cannot be recovered.
              </p>
            </div>
          )}
        </div>
        <div className='sv-popup-widget__section'>
          <b className='sv-divider sv-divider--top' />
          <div className='sv-popup-widget__action'>
            <Button
              text='Cancel'
              shape='rounded'
              actions={{
                onClick: () => {
                  setErrors({});
                  setNavigation({
                    leftWidget: [],
                    centerWidget: username !== null ? 'ProfileOverviewCard' : 'Onboarding',
                    rightWidget: ['ProfileImportCard'],
                  });
                },
              }}
            />
            <Button
              text='Import'
              shape='rounded'
              icon={{
                variant: isLoading ? 'loading' : 'login',
              }}
              disabled={isLoading || rateLimited || !usernameInput || !accessKeyInput}
              actions={{
                onClick: handleImportProfileSubmit,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
