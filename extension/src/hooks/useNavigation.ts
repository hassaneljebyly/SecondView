import { useContext } from 'react';

import { NavigationContext } from '@/context/NavigationContext';
import type { NavigationState, WidgetType } from '@/types/components';

/**
 * Custom React hook to manage widget navigation within a SecondView popup.
 *
 * This hook provides contextual navigation state and helper values for rendering
 * different popup widgets (e.g., profile cards, credential cards, import cards).
 *
 * It determines the widget's visual position (`left`, `center`, or `right`) within
 * the popup based on the current navigation state from the `NavigationContext`.
 *
 * @param {WidgetType} widget - The widget component identifier for which navigation state is being retrieved.
 *
 * @throws {Error} Throws an error if the `NavigationContext` is not available (i.e., the hook is used outside its provider).
 *
 * @returns {{
 *   navigation: NavigationState,
 *   handleNavigation: (args: NavigationState) => void,
 *   widgetStateClass: string,
 *   isInert: boolean
 * }} An object containing:
 * - `navigation`: The current navigation state with left, center, and right widgets.
 * - `handleNavigation`: A function to update the navigation state.
 * - `widgetStateClass`: A string representing the widget’s CSS class for visual positioning.
 * - `isInert`: A boolean indicating whether the widget should be non-interactive (true if not in the center position).
 *
 * @example
 * ```tsx
 * const { widgetStateClass, isInert, handleNavigation } = useNavigation('ProfileOverviewCard');
 *
 * return (
 *   <div className={widgetStateClass} inert={isInert}>
 *     <ProfileOverview />
 *   </div>
 * );
 * ```
 */
export function useNavigation(widget: WidgetType): {
  navigation: NavigationState;
  handleNavigation: (args: NavigationState) => void;
  widgetStateClass: string;
  isInert: boolean;
} {
  const navigationContext = useContext(NavigationContext);

  if (!navigationContext) {
    throw new Error('Something went wrong with contextAPI');
  }

  const { navigation, handleNavigation } = navigationContext;

  let widgetStateClass = 'sv-popup-widget--hidden';
  let isInert = false;
  if (navigation['centerWidget'] === widget) widgetStateClass = 'sv-popup-widget--center';
  if (navigation['leftWidget'].includes(widget)) widgetStateClass = 'sv-popup-widget--left';
  if (navigation['rightWidget'].includes(widget)) widgetStateClass = 'sv-popup-widget--right';
  isInert = !widgetStateClass.includes('center');
  return { navigation, handleNavigation, widgetStateClass, isInert };
}
