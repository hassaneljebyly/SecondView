import { useState } from 'react';

import { NavigationContextProvider } from '@/context/NavigationContext';

import AccessCredentialsCard from './AccessCredentialsCard';
import ImportFailCard from './ImportFailCard';
import ImportSuccessCard from './ImportSuccessCard';
import ProfileImportCard from './ProfileImportCard';
import ProfileOverviewCard from './ProfileOverviewCard';

export const fakeUserName = 'Lucky-Cookie-fd278299';
export const fakeAccessKey = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6';

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

export function generateCopyAllText({
  userName,
  accessKey,
}: {
  userName: string;
  accessKey: string;
}) {
  return `SecondView - Profile Sync\nUsername: ${userName}\nAccess Key: ${accessKey}\nKeep this information secure. You'll need both to sync your profile to other devices.`;
}
