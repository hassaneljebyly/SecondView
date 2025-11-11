import React, { createContext, useEffect, useState, type JSX } from 'react';

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
  const [navigation, setNavigation] = useState<NavigationState>({
    leftWidget: [],
    centerWidget: 'ProfileOverviewCard',
    rightWidget: ['AccessCredentialsCard', 'ProfileImportCard'],
  });

  function handleNavigation({ leftWidget, centerWidget, rightWidget }: NavigationState) {
    setNavigation({ leftWidget, centerWidget, rightWidget });
  }

  const contextValue = { navigation, handleNavigation };
  useEffect(() => {
    requestAnimationFrame(() => {
      const activeWidget = document.querySelector(
        '.sv-popup-widget__inner-container:has(.sv-popup-widget--center)'
      );

      const popupContainer = document.querySelector('.sv-popup');
      if (activeWidget && popupContainer) {
        const height = getComputedStyle(activeWidget)['height'];
        setWidgetHight(height);
      }
    });
  });
  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>;
}
