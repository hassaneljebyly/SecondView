import { useState } from 'react';

import { useNavigation } from '@/hooks/useNavigation';
import { logger } from '@/utils/lib/logger';
import { generateCopyAllText, generateCredentialsFile } from '@/utils/scripts/copy-credential';

import { fakeAccessKey, fakeUserName } from './ExtensionPopup';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import Icon from '../ui/Icon';

type SaveAction = 'userName' | 'accessKey' | 'all' | 'file';

type SaveState = {
  status: 'idle' | 'saving' | 'saved' | 'error';
  errorMessage: string | null;
};

type SaveStateMap = Record<SaveAction, SaveState>;
const initialSaveState: SaveState = {
  status: 'idle',
  errorMessage: null,
};

const initialSaveMap: SaveStateMap = {
  userName: initialSaveState,
  accessKey: initialSaveState,
  all: initialSaveState,
  file: initialSaveState,
};

const errorsMap: Record<SaveAction, string> = {
  userName:
    "We couldn't complete the requested action: copying the user name. Please Clipboard permissions or try again.",
  accessKey:
    "We couldn't complete the requested action: copying the access key. Please Clipboard permissions or try again.",
  all: "We couldn't complete the requested action: copying the user name and access key. Please Clipboard permissions or try again.",
  file: "We couldn't complete the requested action: saving the file. Make sure the download wasn't blocked.",
};

const stateDelay = 1500;
export default function AccessCredentialsCard() {
  const { handleNavigation, widgetStateClass, isInert } = useNavigation('AccessCredentialsCard');
  const [saveActionState, setSaveActionState] = useState<SaveStateMap>(initialSaveMap);
  function handleCredentialsSave(saveAction: SaveAction) {
    const updateStatus = (
      action: SaveAction,
      status: 'saving' | 'saved' | 'idle' | 'error',
      errorMessage: string | null = null
    ) => {
      setSaveActionState(prev => ({
        ...prev,
        [action]: { status, errorMessage },
      }));
    };

    updateStatus(saveAction, 'saving');
    try {
      if (saveAction === 'file') {
        const { success, errorMessage } = generateCredentialsFile({
          userName: fakeUserName,
          accessKey: fakeAccessKey,
        });

        if (success) {
          updateStatus('file', 'saved');

          setTimeout(() => updateStatus('file', 'idle'), stateDelay);
        } else {
          updateStatus('file', 'error', errorMessage);
        }
      } else {
        const itemsToCopyMap: Record<Exclude<SaveAction, 'file'>, string> = {
          userName: fakeUserName,
          accessKey: fakeAccessKey,
          all: generateCopyAllText({
            userName: fakeUserName,
            accessKey: fakeAccessKey,
          }),
        };
        navigator.clipboard.writeText(itemsToCopyMap[saveAction]).then(() => {
          updateStatus(saveAction, 'saved');
          setTimeout(() => updateStatus(saveAction, 'idle'), stateDelay);
        });
      }
    } catch (error) {
      logger.error(`${errorsMap[saveAction]}\n${error}`);
      updateStatus(saveAction, 'error', errorsMap[saveAction]);
    } finally {
      setTimeout(() => {
        updateStatus(saveAction, 'idle');
      }, stateDelay);
    }
  }

  const currentErrorField = Object.entries(saveActionState)
    .map(([field, value]) => {
      return value['errorMessage'] ? field : null;
    })
    .filter(Boolean)[0];
  const errorMessage =
    typeof currentErrorField === 'string' ? errorsMap[currentErrorField as SaveAction] : '';
  return (
    <div className='sv-popup-widget__inner-container' inert={isInert}>
      <div
        aria-errormessage='sv-error-all'
        className={`sv-popup-widget ${widgetStateClass} sv-popup-widget--access-credentials sv-access-credentials`}
      >
        <div className='sv-popup-widget__section sv-popup-widget__section--header sv-divider sv-divider--bottom'>
          <Icon variant='shield' />
          <p className='sv-popup-widget__section-title'>Your Access Credentials</p>
        </div>
        <div className='sv-popup-widget__section'>
          <p className='sv-popup-widget__hint'>Save both to sync to other devices:</p>
          <div
            className={`sv-popup-widget__error-wrapper${errorMessage.length ? ' sv-popup-widget__error-wrapper--has-error' : ''}`}
          >
            {/* // [🧱 REFACTOR]: improve error displaying */}
            <ErrorMessage id='sv-error-all' global errorMessage={errorMessage} />
          </div>
          <ReadOnlyFieldCopy
            label='Username'
            id='sv-username-readonly'
            value={fakeUserName}
            copiedState={saveActionState['userName']['status']}
            onCopy={() => handleCredentialsSave('userName')}
          />
          <ReadOnlyFieldCopy
            label='Access key'
            id='sv-access-key-readonly'
            value={fakeAccessKey}
            copiedState={saveActionState['accessKey']['status']}
            onCopy={() => handleCredentialsSave('accessKey')}
          />
          <div className='sv-popup-widget__action' aria-errormessage='sv-error-file-copy-all'>
            <Button
              icon={{ variant: saveActionState['all']['status'] === 'idle' ? 'copy' : 'check' }}
              text={saveActionState['all']['status'] === 'saved' ? 'Copied!!' : 'Copy All'}
              shape='rounded'
              actions={{ onClick: () => handleCredentialsSave('all') }}
            />
            <Button
              icon={{
                variant: saveActionState['file']['status'] === 'idle' ? 'fileDownload' : 'check',
              }}
              text='Download'
              shape='rounded'
              actions={{ onClick: () => handleCredentialsSave('file') }}
            />
          </div>
        </div>
        <div className='sv-popup-widget__section'>
          <b className='sv-divider sv-divider--top' />
          <p className='sv-popup-widget__section-title'>Security Tips:</p>
          <ul className='sv-popup-widget__info-list'>
            <li className='sv-popup-widget__hint'>Save in a password manager</li>
            <li className='sv-popup-widget__hint'>Keep your access key private</li>
            <li className='sv-popup-widget__hint'>Anyone with both can use your profile</li>
          </ul>
          <Button
            text='Close'
            shape='rounded'
            actions={{
              onClick: () =>
                handleNavigation({
                  leftWidget: [],
                  centerWidget: 'ProfileOverviewCard',
                  rightWidget: ['AccessCredentialsCard'],
                }),
            }}
          />
        </div>
      </div>
    </div>
  );
}

type ReadOnlyFieldCopyProps = {
  label: string;
  id: string;
  value: string;
  copiedState: SaveState['status'];
  onCopy: () => void;
};

function ReadOnlyFieldCopy({ label, id, value, copiedState, onCopy }: ReadOnlyFieldCopyProps) {
  return (
    <>
      <label htmlFor={id} className='sv-popup-widget__section-title sv-access-credentials__labels'>
        {label}
      </label>

      <div className='sv-access-credentials__input-container'>
        <input id={id} className='sv-input' readOnly value={value} aria-errormessage={id} />
        <Button
          text={`copy ${label}`}
          iconOnly
          type='button'
          icon={{ variant: copiedState === 'idle' ? 'copy' : 'check' }}
          actions={{ onClick: onCopy }}
        />
      </div>
    </>
  );
}
