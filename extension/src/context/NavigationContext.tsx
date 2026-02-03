import React, { createContext, useEffect, useState, type JSX } from 'react';

import useProfile from '@/hooks/useProfile';
import type { NavigationContextValue, NavigationState } from '@/types/components';

export const NavigationContext = createContext<NavigationContextValue | null>(null);

/**
 * Provider component for managing and sharing popup widget navigation state across the SecondView popup UI.
 *
 * This component initializes and maintains the navigation state for the popup,
 * ensuring that widget transitions (left, center, right) are tracked and rendered consistently.
 *
 * It also measures the currently active widget’s height using `requestAnimationFrame`
 * and updates the popup container’s height dynamically via `setWidgetHight`.
 *
 * @param {{
 *   children: JSX.Element[];
 *   setWidgetHight: React.Dispatch<React.SetStateAction<string>>;
 * }} props - The provider props.
 * @param {JSX.Element[]} props.children - The child components that will consume the navigation context.
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setWidgetHight - Setter function used to adjust popup height dynamically.
 *
 * @returns {JSX.Element} The context provider wrapping its child components.
 */
export function NavigationContextProvider({
  children,
  setWidgetHight,
}: {
  children: JSX.Element[];
  setWidgetHight: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  const { profile } = useProfile();
  const [navigation, setNavigation] = useState<NavigationState>({
    leftWidget: [],
    centerWidget: profile.user.id === null ? 'Onboarding' : 'ProfileOverviewCard',
    rightWidget: ['AccessCredentialsCard', 'ProfileImportCard'],
  });

  const contextValue = { navigation, setNavigation };

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const activeWidget = document.querySelector(
          '.sv-popup-widget__inner-container:has(.sv-popup-widget--center)'
        );

        const popupContainer = document.querySelector('.sv-popup');
        if (activeWidget && popupContainer) {
          const height = getComputedStyle(activeWidget)['height'];
          setWidgetHight(height);
        }
      }, 0);
    });
  });
  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>;
}
