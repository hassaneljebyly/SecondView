import Button from '../ui/Button';
import Icon from '../ui/Icon';

export default function AccessCredentialsCard() {
  return (
    <div className='sv-popup-widget sv-popup-widget--access-credentials sv-access-credentials'>
      <div className='sv-popup-widget__section sv-popup-widget__section--header sv-divider sv-divider--bottom'>
        <Icon variant='shield' />
        <p className='sv-popup-widget__section-title'>Your Access Credentials</p>
      </div>
      <div className='sv-popup-widget__section'>
        <p className='sv-popup-widget__hint'>Save both to sync to other devices:</p>
        <label
          htmlFor='sv-username-readonly'
          className='sv-popup-widget__section-title sv-access-credentials__labels'
        >
          Username:
        </label>
        <div className='sv-access-credentials__input-container'>
          <input
            id='sv-username-readonly'
            className='sv-input'
            readOnly
            value='Lucky-Cookie-fd278299'
          />
          <Button text='copy username' iconOnly type='button' icon={{ variant: 'copy' }} />
        </div>
        <label
          htmlFor='sv-access-key-readonly'
          className='sv-popup-widget__section-title sv-access-credentials__labels'
        >
          Access Key:
        </label>
        <div className='sv-access-credentials__input-container'>
          <input
            id='sv-access-key-readonly'
            className='sv-input'
            readOnly
            value='f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
          />
          <Button text='copy access-key' iconOnly type='button' icon={{ variant: 'copy' }} />
        </div>
        <div className='sv-popup-widget__action'>
          <Button text='Copy Credentials' shape='rounded' />
          <Button text='Save as .txt' shape='rounded' />
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
        <Button text='Close' shape='rounded' />
      </div>
    </div>
  );
}
