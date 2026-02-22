import { useEffect, useState } from 'react';

import { NavigationContextProvider } from '@/context/NavigationContext';

import AccessCredentialsCard from './AccessCredentialsCard';
import ImportSuccessCard from './ImportSuccessCard';
import Onboarding from './Onboarding';
import ProfileImportCard from './ProfileImportCard';
import ProfileOverviewCard from './ProfileOverviewCard';
import SnackBar from '../content/SnackBar';

export default function MainPopup() {
  const [widgetHight, setWidgetHight] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!mounted) setMounted(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, [mounted]);
  return (
    <div
      className={`sv-popup ${!mounted ? 'sv-popup--initial' : ''}`}
      style={{ height: widgetHight }}
    >
      <NavigationContextProvider setWidgetHight={setWidgetHight}>
        <Onboarding />
        <ProfileOverviewCard />
        <ProfileImportCard />
        <AccessCredentialsCard />
        <ImportSuccessCard />
      </NavigationContextProvider>
      <SnackBar />
    </div>
  );
}
