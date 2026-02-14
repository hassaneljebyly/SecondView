import type React from 'react';
import { createContext, useState, type JSX } from 'react';

export type NavigationPanels = 'note' | 'note-rating' | 'note-details';
export type NavigationStack = NavigationPanels[];
export type PanelNavigationRegistry = {
  [P in NavigationPanels]?: JSX.Element;
};

export type StackedNavigationValue = {
  dispatchNavigateForward: (navigateTo: NavigationPanels) => void;
  dispatchNavigateBack: () => void;
  navigationStack: NavigationStack;
  setNavigationStack: React.Dispatch<React.SetStateAction<NavigationStack>>;
  navigationStackSize: number;
  setNavigationStackSize: React.Dispatch<React.SetStateAction<number>>;
  navigationDirection: 'back' | 'forward';
  setNavigationDirection: React.Dispatch<React.SetStateAction<'back' | 'forward'>>;
};

export const StackedNavigationContext = createContext<StackedNavigationValue | null>(null);

export function StackedNavigationProvider({ children }: { children: React.ReactNode }) {
  const [navigationStack, setNavigationStack] = useState<NavigationStack>(['note']);
  const [navigationStackSize, setNavigationStackSize] = useState(1);
  const [navigationDirection, setNavigationDirection] = useState<'back' | 'forward'>('forward');

  function dispatchNavigateForward(navigateTo: NavigationPanels) {
    if (navigationStack.includes(navigateTo)) return;
    setNavigationDirection('forward');
    setNavigationStackSize(prev => prev + 1);
    setNavigationStack(prevNavStack => {
      return [...prevNavStack, navigateTo];
    });
  }
  function dispatchNavigateBack() {
    setNavigationDirection('back');
    setNavigationStackSize(prev => prev - 1);
  }

  return (
    <StackedNavigationContext.Provider
      value={{
        dispatchNavigateForward,
        dispatchNavigateBack,
        setNavigationStack,
        setNavigationStackSize,
        setNavigationDirection,
        navigationStackSize,
        navigationStack,
        navigationDirection,
      }}
    >
      {children}
    </StackedNavigationContext.Provider>
  );
}
