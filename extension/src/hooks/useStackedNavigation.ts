import { useContext } from 'react';

import { StackedNavigationContext } from '@/context/StackedNavigationContext';

export function useStackedNavigation() {
  const stackedNavigationContext = useContext(StackedNavigationContext);

  if (!stackedNavigationContext) {
    throw new Error('Something went wrong with contextAPI');
  }

  return stackedNavigationContext;
}
