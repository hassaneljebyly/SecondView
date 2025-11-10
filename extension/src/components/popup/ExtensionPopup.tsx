import { useState } from 'react';

import AccessCredentialsCard from './AccessCredentialsCard';
import ImportFailCard from './ImportFailCard';
import ImportSuccessCard from './ImportSuccessCard';
import ProfileImportCard from './ProfileImportCard';
import ProfileOverviewCard from './ProfileOverviewCard';

type WidgetType =
  | 'ProfileOverviewCard'
  | 'AccessCredentialsCard'
  | 'ProfileImportCard'
  | 'ImportSuccessCard'
  | 'ImportFailCard';
type NavigationState = {
  previousWidget: WidgetType | null;
  currentWidget: WidgetType;
  nextWidget: WidgetType | null;
};

export default function MainPopup() {
  const [navigation, setNavigation] = useState<NavigationState>({
    previousWidget: null,
    currentWidget: 'ProfileOverviewCard',
    nextWidget: null,
  });
  return (
    <div className='popup'>
      <ProfileOverviewCard />
      <AccessCredentialsCard />
      <ProfileImportCard />
      <ImportSuccessCard />
      <ImportFailCard />
    </div>
  );
}
