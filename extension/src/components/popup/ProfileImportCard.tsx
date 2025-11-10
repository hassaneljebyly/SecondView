import Button from '../ui/Button';
import Icon from '../ui/Icon';

export default function ProfileImportCard() {
  return (
    <div className='sv-popup-widget sv-popup-widget--profile-import sv-profile-import'>
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
          <input id='sv-username-editable' className='sv-input' placeholder='fancy-face12345' />
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
            You have an existing profile: Happy-Wolf-xyz789 (5 notes, 12 ratings). Importing will
            replace it permanently
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
          <Button text='Cancel' shape='rounded' />
          <Button text='Import' shape='rounded' />
        </div>
      </div>
    </div>
  );
}
