// reference https://m3.material.io/components/snackbar/specs

import Button from '@/components/ui/Button';

export const snackBarId = 'sv-snackbar';

export default function SnackBar() {
  const initIalClass = 'sv-animation-pop-in-initial';
  const showSnackBarClass = 'sv-animation-pop-in';
  return (
    <div id={snackBarId} className={`sv-snackbar ${initIalClass}`}>
      <p className='sv-snackbar__text'>Single line snackbar with action</p>
      <div className='sv-snackbar__controls'>
        <div className='sv-snackbar__action'>
          <Button text='Action' noDarkMode theme='light' shape='rounded' />
        </div>
        <div className='sv-snackbar__close'>
          <Button text='close notification' icon={{ variant: 'cancel', size: 'xs' }} iconOnly />
        </div>
      </div>
    </div>
  );
}

// Container
//
// Icon (optional close affordance)
//
// Action (optional)
//
// Supporting text
