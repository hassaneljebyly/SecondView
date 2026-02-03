import { useState } from 'react';

import { NavigationContextProvider } from '@/context/NavigationContext';

import AccessCredentialsCard from './AccessCredentialsCard';
import ImportFailCard from './ImportFailCard';
import ImportSuccessCard from './ImportSuccessCard';
import Onboarding from './Onboarding';
import ProfileImportCard from './ProfileImportCard';
import ProfileOverviewCard from './ProfileOverviewCard';

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
        <ImportFailCard />
      </NavigationContextProvider>
    </div>
  );
}
