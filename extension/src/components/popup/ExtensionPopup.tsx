import { useState } from 'react';

import { NavigationContextProvider } from '@/context/NavigationContext';

import AccessCredentialsCard from './AccessCredentialsCard';
import ImportFailCard from './ImportFailCard';
import ImportSuccessCard from './ImportSuccessCard';
import ProfileImportCard from './ProfileImportCard';
import ProfileOverviewCard from './ProfileOverviewCard';

export default function MainPopup() {
  const [widgetHight, setWidgetHight] = useState('');
  return (
    <div className='sv-popup' style={{ height: widgetHight }}>
      <NavigationContextProvider setWidgetHight={setWidgetHight}>
        <ImportSuccessCard />
        <ImportFailCard />
        <ProfileImportCard />
        <AccessCredentialsCard />
        <ProfileOverviewCard />
      </NavigationContextProvider>
    </div>
  );
}
