import { useState } from 'react';

import { NavigationContextProvider } from '@/context/NavigationContext';

import AccessCredentialsCard from './AccessCredentialsCard';
import ImportSuccessCard from './ImportSuccessCard';
import Onboarding from './Onboarding';
import ProfileImportCard from './ProfileImportCard';
import ProfileOverviewCard from './ProfileOverviewCard';
import SnackBar from '../content/SnackBar';

export default function MainPopup() {
  const [widgetHight, setWidgetHight] = useState('');
  return (
    <div className='sv-popup' style={{ height: widgetHight }}>
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
