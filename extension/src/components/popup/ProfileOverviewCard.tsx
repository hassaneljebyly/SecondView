import { initialProfile } from '@/api/apiHandlers/user';
import { useNavigation } from '@/hooks/useNavigation';
import useProfile from '@/hooks/useProfile';
import type { ShowSnackBarEvent } from '@/utils/config/customEventsConfig';
import { globalEventSingleton } from '@/utils/lib/events';
import { getUserTier } from '@/utils/lib/helpers';

import { strToHsl } from '../helpers/usernameToHsl';
import Button from '../ui/Button';

export default function ProfileOverviewCard() {
  const { setNavigation, widgetStateClass, isInert } = useNavigation('ProfileOverviewCard');

  const {
    profile: {
      user: { username, userReputation },
    },
    update,
  } = useProfile();

  function handleLogout() {
    setNavigation({
      leftWidget: [],
      centerWidget: 'Onboarding',
      rightWidget: ['ProfileImportCard', 'ProfileOverviewCard'],
    });
  }
  const avatarBgColor = username ? strToHsl(username) : '#000';
  return (
    <div className='sv-popup-widget__inner-container' inert={isInert}>
      <div
        className={`sv-popup-widget ${widgetStateClass} sv-popup-widget--profile-overview sv-profile-overview`}
      >
        <div className='sv-popup-widget__section sv-profile-overview__header'>
          <div className='sv-profile-overview__cover-container'>
            <img
              width={298}
              height={122.453}
              className='sv-profile-overview__cover-image'
              src='https://i.imgur.com/05YkqBj.png'
              alt='Cover'
            />
            <div
              className='sv-profile-overview__avatar-container'
              aria-hidden
              style={{ backgroundColor: avatarBgColor }}
            >
              <span className='sv-profile-overview__username-initials'>
                {username?.charAt(0) || ''}
              </span>
              {/*
               * // TODO(me/#3): 📝 Add custom image support
               * // Issue: https://github.com/hassaneljebyly/SecondView/issues/3
               */}
              <img className='sv-profile-overview__avatar-img' src={undefined} alt='' />
            </div>
            <Button
              text='Log out'
              iconOnly
              icon={{
                variant: 'logout',
              }}
              actions={{
                onClick: () => {
                  globalEventSingleton.emit('snackBar:show', window, {
                    detail: {
                      status: 'warning',
                      text: "Have you backed up your credentials? You won't be able to recover your account without it.",
                      actionLabel: 'Continue',
                      action: () => {
                        // @ts-expect-error initial user has fields but null by default (e.g no user)
                        update('user', () => initialProfile.user);
                        handleLogout();
                      },
                    } as ShowSnackBarEvent,
                  });
                },
              }}
            />
          </div>
        </div>
        <div className='sv-popup-widget__section sv-profile-overview__user'>
          <p className='sv-popup-widget__section-title sv-profile-overview__username'>{username}</p>
          {/* // TODO(me): 📝 see https://share.google/aimode/S96lNMwNr8fy0juDS */}
          <p className='sv-profile-overview__badge'>{getUserTier(userReputation || 0)}</p>
        </div>
        <div className='sv-popup-widget__section sv-profile-overview__stats'>
          <b className='sv-divider sv-divider--top' />
          <p className='sv-popup-widget__section-title'>Contribution Overview</p>
          <ul className='sv-profile-overview__stats-list'>
            <li className='sv-profile-overview__stats-item'>
              Notes: <span title='Experimental data'>12*</span>
            </li>
            <li className='sv-profile-overview__stats-item'>
              Helpful: <span title='Experimental data'>156*</span>
            </li>
            <li className='sv-profile-overview__stats-item'>
              Ratings: <span title='Experimental data'>34*</span>
            </li>
            <li className='sv-profile-overview__stats-item'>
              Accurate: <span title='Experimental data'>89%*</span>
            </li>
          </ul>
          <p className='sv-coming-soon-note'>*Placeholder data, user stats coming soon.</p>
        </div>
        <div className='sv-popup-widget__section sv-profile-overview__sync'>
          <b className='sv-divider sv-divider--top' />
          <p className='sv-popup-widget__section-title'>Sync Across Devices</p>
          <p className='sv-popup-widget__hint'>Use your profile on other devices.</p>
          <div className='sv-profile-overview__action'>
            <Button
              text='Access Key'
              shape='rounded'
              actions={{
                onClick: () => {
                  setNavigation({
                    leftWidget: ['ProfileOverviewCard', 'Onboarding'],
                    centerWidget: 'AccessCredentialsCard',
                    rightWidget: [],
                  });
                },
              }}
            />
            <Button
              text='Use Profile'
              shape='rounded'
              actions={{
                onClick: () =>
                  setNavigation({
                    leftWidget: ['ProfileOverviewCard', 'Onboarding'],
                    centerWidget: 'ProfileImportCard',
                    rightWidget: ['ImportFailCard', 'ImportSuccessCard'],
                  }),
              }}
            />
          </div>
        </div>
        <div className='sv-popup-widget__section sv-profile-overview__footer'>
          <b className='sv-divider sv-divider--top' />
          <ul className='sv-profile-overview__footer-list'>
            <li>
              <a
                className='sv-popup-widget__links'
                href='https://github.com/hassaneljebyly/SecondView/blob/master/GUIDE.md'
                target='_blank'
                rel='noreferrer'
              >
                Guide
              </a>
            </li>
            <li>
              <a
                className='sv-popup-widget__links'
                href='https://github.com/hassaneljebyly/SecondView/blob/master/PRIVACY.md'
                target='_blank'
                rel='noreferrer'
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                className='sv-popup-widget__links'
                href='https://github.com/hassaneljebyly/SecondView/blob/master/TERMS.md'
                target='_blank'
                rel='noreferrer'
              >
                Terms
              </a>
            </li>
            <li>
              <a
                className='sv-popup-widget__links'
                href='https://github.com/hassaneljebyly/SecondView/issues/new'
                target='_blank'
                rel='noreferrer'
              >
                Report Bug
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
