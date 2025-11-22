import { useNavigation } from '@/hooks/useNavigation';
import useProfile from '@/hooks/useProfile';

import Button from '../ui/Button';
import Icon from '../ui/Icon';

export default function ImportSuccessCard() {
  const { handleNavigation, widgetStateClass, isInert } = useNavigation('ImportSuccessCard');
  const {
    profile: { userName },
  } = useProfile();

  return (
    <div className='sv-popup-widget__inner-container' inert={isInert}>
      <div
        className={`sv-popup-widget ${widgetStateClass} sv-popup-widget--import-success sv-import-success`}
      >
        <div className='sv-popup-widget__section sv-popup-widget__section--header sv-divider sv-divider--bottom'>
          <Icon variant='check' />
          <p className='sv-popup-widget__section-title'>Profile Imported Successfully!</p>
        </div>
        <div className='sv-popup-widget__section'>
          <p className='sv-popup-widget__hint'>
            Welcome back, <span>{userName}!</span>
          </p>
          <p className='sv-popup-widget__section-title sv-import-success__section-title'>
            Your Stats:
          </p>
          <ul className='sv-popup-widget__info-list'>
            <li className='sv-popup-widget__hint'>
              <span>12</span> notes published
            </li>
            <li className='sv-popup-widget__hint'>
              <span>34</span> ratings given
            </li>
            <li className='sv-popup-widget__hint'>
              <span>89%</span> accuracy
            </li>
            <li className='sv-popup-widget__hint'>
              <span>547</span> reputation points
            </li>
          </ul>
          <Button
            text='Continue'
            shape='rounded'
            actions={{
              onClick: () =>
                handleNavigation({
                  leftWidget: [],
                  centerWidget: 'ProfileOverviewCard',
                  rightWidget: ['ImportSuccessCard'],
                }),
            }}
          />
        </div>
      </div>
    </div>
  );
}
