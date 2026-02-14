import { useEffect, useRef, useState } from 'react';

import type { PanelNavigationRegistry } from '@/context/StackedNavigationContext';
import { useStackedNavigation } from '@/hooks/useStackedNavigation';
import { logger } from '@/utils/lib/logger';

export function StackedNavigation(panelsRegistry: PanelNavigationRegistry) {
  const { navigationStack, navigationStackSize, setNavigationStack, navigationDirection } =
    useStackedNavigation();
  const [incomingPanelHeight, setIncomingPanelHeight] = useState('');
  const listWrapperRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    try {
      const { current: listWrapper } = listWrapperRef;
      if (!listWrapper) return;
      const nextPanel =
        navigationDirection === 'forward'
          ? listWrapper.lastChild
          : listWrapper.lastChild!.previousSibling;
      // @ts-expect-error complains about nextPanel being ChildNode instead of Element
      const nextPanelHeight = getComputedStyle(nextPanel).height;
      if (navigationStack.length > 1) setIncomingPanelHeight(nextPanelHeight);
    } catch (error) {
      logger.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationStackSize]);
  // TECHDEBT(me): ⚙️ later improve accessibility
  return (
    <div
      id='sv-stacked-navigation'
      className='sv-stacked-navigation'
      style={{ height: incomingPanelHeight }}
    >
      <ul
        ref={listWrapperRef}
        onTransitionEnd={e => {
          if (
            e.propertyName === 'translate' &&
            e.target === e.currentTarget &&
            navigationDirection === 'back' &&
            navigationStack.length > 1
          ) {
            setNavigationStack(prevNavStack => {
              return [...prevNavStack.slice(0, -1)];
            });
          }
        }}
        className={`sv-stacked-navigation__list-wrapper sv-stacked-navigation--move-${navigationDirection}`}
        style={{
          translate: `calc(${-1 * (navigationStackSize - 1)}*var(--sv-note-width))`,
        }}
      >
        {navigationStack.map((stack, idx) => {
          const c =
            navigationStack.length > 1
              ? idx === 0
                ? navigationDirection === 'back'
                  ? 'coming'
                  : 'leaving'
                : navigationDirection === 'forward'
                  ? 'coming'
                  : 'leaving'
              : '';
          return (
            <li
              key={stack}
              className={`sv-stacked-navigation__panel ${'sv-stacked-navigation__panel--' + c}`}
            >
              {panelsRegistry[stack]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
