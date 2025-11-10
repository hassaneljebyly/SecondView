import Button from '../ui/Button';

export default function ProfileOverviewCard() {
  return (
    <div className='sv-popup-widget sv-popup-widget--profile-overview sv-profile-overview'>
      <div className='sv-popup-widget__section sv-profile-overview__header'>
        <div className='sv-profile-overview__cover-container'>
          <img
            className='sv-profile-overview__cover-image'
            src='https://i.imgur.com/05YkqBj.png'
            alt='Cover'
          />
          <div className='sv-profile-overview__avatar-container' aria-hidden>
            <span className='sv-profile-overview__username-initials'>L</span>
            {/* [🚀 FEATURE]: maybe in future add custom image */}
            <img className='sv-profile-overview__avatar-img' src={undefined} alt='' />
          </div>
          <Button
            text=''
            icon={{
              variant: 'setting',
            }}
          />
        </div>
      </div>
      <div className='sv-popup-widget__section sv-profile-overview__user'>
        <p className='sv-popup-widget__section-title sv-profile-overview__username'>
          Lucky-Cookie-fd278299
        </p>
        <p className='sv-profile-overview__badge'>Trusted Contributor</p>
      </div>
      <div className='sv-popup-widget__section sv-profile-overview__stats'>
        <b className='sv-divider sv-divider--top' />
        <p className='sv-popup-widget__section-title'>Contribution Overview</p>
        <ul className='sv-profile-overview__stats-list'>
          <li className='sv-profile-overview__stats-item'>
            Notes: <span>12</span>
          </li>
          <li className='sv-profile-overview__stats-item'>
            Helpful: <span>156</span>
          </li>
          <li className='sv-profile-overview__stats-item'>
            Ratings: <span>34</span>
          </li>
          <li className='sv-profile-overview__stats-item'>
            Accurate: <span>89%</span>
          </li>
        </ul>
      </div>
      <div className='sv-popup-widget__section sv-profile-overview__sync'>
        <b className='sv-divider sv-divider--top' />
        <p className='sv-popup-widget__section-title'>Sync Across Devices</p>
        <p className='sv-popup-widget__hint'>Use your profile on other devices.</p>
        <div className='sv-profile-overview__action'>
          <Button text='Access Key' shape='rounded' />
          <Button text='Use Profile' shape='rounded' />
        </div>
      </div>
      <div className='sv-popup-widget__section sv-profile-overview__footer'>
        <b className='sv-divider sv-divider--top' />
        <ul className='sv-profile-overview__footer-list'>
          <li>
            <a className='sv-popup-widget__links' href='#'>
              Guide
            </a>
          </li>
          <li>
            <a className='sv-popup-widget__links' href='#'>
              Privacy
            </a>
          </li>
          <li>
            <a className='sv-popup-widget__links' href='#'>
              Terms
            </a>
          </li>
          <li>
            <a className='sv-popup-widget__links' href='#'>
              Report Bug
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
