import { useNavigation } from '@/hooks/useNavigation';

import Button from '../ui/Button';
import Icon from '../ui/Icon';

export default function ImportFailCard() {
  const { handleNavigation, widgetStateClass, isInert } = useNavigation('ImportFailCard');
  return (
    <div className='sv-popup-widget__inner-container' inert={isInert}>
      <div
        className={`sv-popup-widget ${widgetStateClass} sv-popup-widget--import-fail sv-import-fail`}
      >
        <div className='sv-popup-widget__section sv-popup-widget__section--header sv-divider sv-divider--bottom'>
          <Icon variant='error' />
          <p className='sv-popup-widget__section-title'>Import Failed</p>
        </div>
        <div className='sv-popup-widget__section'>
          <p className='sv-popup-widget__hint'>
            The credentials you entered don&apos;t match any existing profile.
          </p>
          <p className='sv-popup-widget__section-title sv-import-success__section-title'>
            Your Stats:
          </p>
          <ul className='sv-popup-widget__info-list'>
            <li className='sv-popup-widget__hint'>Username is spelled correctly</li>
            <li className='sv-popup-widget__hint'>Access key is complete</li>
            <li className='sv-popup-widget__hint'>
              You&apos;re using credentials from the same extension
            </li>
          </ul>
          <Button
            text='Try Again'
            shape='rounded'
            actions={{
              onClick: () =>
                handleNavigation({
                  leftWidget: ['ProfileOverviewCard'],
                  centerWidget: 'ProfileImportCard',
                  rightWidget: ['ImportFailCard'],
                }),
            }}
          />
        </div>
      </div>
    </div>
  );
}
