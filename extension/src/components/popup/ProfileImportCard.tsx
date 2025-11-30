import { useNavigation } from '@/hooks/useNavigation';
import useProfile from '@/hooks/useProfile';
import { createNewUserAndAccessKey } from '@shared/utils/format/generateUserName';

import Button from '../ui/Button';
import Icon from '../ui/Icon';

export default function ProfileImportCard() {
  const { handleNavigation, widgetStateClass, isInert } = useNavigation('ProfileImportCard');
  const {
    profile: { userName },
    updateStorageField,
  } = useProfile();
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
          <p className='sv-popup-widget__hint'>Enter your credentials from another device:</p>
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
              placeholder='second-view-1a2b3c4d'
            />
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
            />
          </div>
          {/* // [🧱 REFACTOR]: move to its own component */}
          <div className='sv-reminders'>
            <Icon variant='error' />
            <p>
              You have an existing profile: {userName} (5 notes, 12 ratings). Importing will replace
              it permanently
            </p>
          </div>
        </div>
        <div className='sv-popup-widget__section'>
          <b className='sv-divider sv-divider--top' />
          <p className='sv-popup-widget__section-title'>Security Tips:</p>
          <ul className='sv-popup-widget__info-list'>
            <li className='sv-popup-widget__hint'>
              You can find these by clicking &quot;Access Key&quot; on your other device.
            </li>
          </ul>
          <div className='sv-popup-widget__action'>
            <Button
              text='Cancel'
              shape='rounded'
              actions={{
                onClick: () =>
                  handleNavigation({
                    leftWidget: [],
                    centerWidget: 'ProfileOverviewCard',
                    rightWidget: ['ProfileImportCard'],
                  }),
              }}
            />
            <Button
              text='Import'
              shape='rounded'
              actions={{
                onClick: () => {
                  // [🚀 FEATURE]:  build actual import feature
                  updateStorageField(createNewUserAndAccessKey());
                  handleNavigation({
                    leftWidget: ['ProfileImportCard', 'ProfileOverviewCard'],
                    centerWidget: 'ImportFailCard',
                    rightWidget: [],
                  });
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
