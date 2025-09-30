import ContributionStats from './ContributionStats';
import QuickLinks from './QuickLinks';
import UserCard from './UserCard';
import Button from '../ui/Button';

export default function MainPopup() {
  return (
    <div className='popup'>
      <UserCard />
      <ContributionStats />
      <QuickLinks />
      <footer className='popup__footer footer'>
        <Button text='settings' icon={{ variant: 'setting' }} shape='rounded' />
      </footer>
    </div>
  );
}
