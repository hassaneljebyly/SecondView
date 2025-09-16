import type { CustomEventMap, GlobalEventNames } from '@/types';

import { logger } from './logger';
import { CUSTOM_EVENTS } from '../config/customEventsConfig';
/**
 * A singleton class that manages global custom event subscription and dispatching.
 * This ensures that all event listeners are tracked, and provides an easy way to:
 * - Subscribe (`on`)
 * - Emit (`emit`)
 * - Cleanup (`destroy`)
 *
 * It uses the browser's `window` event system under the hood.
 */
class GlobalEventSingleton {
  private readonly subscribedEvents: Map<GlobalEventNames, Set<EventListenerOrEventListenerObject>>;
  static instance: GlobalEventSingleton | null = null;

  private constructor() {
    this.subscribedEvents = new Map<GlobalEventNames, Set<EventListenerOrEventListenerObject>>();
  }

  static getInstance() {
    if (GlobalEventSingleton.instance) {
      return GlobalEventSingleton.instance;
    }
    GlobalEventSingleton.instance = new GlobalEventSingleton();
    return GlobalEventSingleton.instance;
  }
  /**
   * Subscribes an event handler to a global event.
   *
   * @param {GlobalEventNames} event - The event name to listen for.
   * @param {EventListenerOrEventListenerObject} eventHandler - The handler function or object.
   * @param {HTMLElement | Window} [target=window] - The target to attach the listener to.
   * @param {boolean | AddEventListenerOptions} [options] - Optional options for `addEventListener`.
   * @returns {{ disconnectEvent: () => void }} An object with a `disconnectEvent` function to unsubscribe the listener.
   */
  on(
    event: GlobalEventNames,
    eventHandler: EventListenerOrEventListenerObject,
    target: HTMLElement | Window = window,
    options?: boolean | AddEventListenerOptions
  ): { disconnectEvent: () => void } {
    // register the event listener with the browser
    target.addEventListener(event, eventHandler, options);
    // get existing handlers for this event or create a new Set
    const currentSubscribedEvents = this.subscribedEvents.get(event) ?? new Set();
    currentSubscribedEvents.add(eventHandler);
    this.subscribedEvents.set(event, currentSubscribedEvents);
    const disconnect = () => {
      // clear event
      target.removeEventListener(event, eventHandler);
      const handlers = this.subscribedEvents.get(event);
      if (handlers) {
        // remove event handler from set
        handlers.delete(eventHandler);
        if (handlers.size === 0) {
          // remove event from map
          this.subscribedEvents.delete(event);
        }
      }
    };

    return {
      disconnectEvent: disconnect,
    };
  }
  /**
   * Dispatches a global custom event if it is recognized.
   *
   * @param {CustomEventMap} event - The event name to dispatch.
   * @param {HTMLElement | Window} [target=window] - The target to attach the listener to.
   * @param {CustomEventInit<unknown>} [data] - Optional event detail data.
   */
  emit(
    event: CustomEventMap,
    target: HTMLElement | Window = window,
    data?: CustomEventInit<unknown>
  ) {
    // runtime validation to prevent malicious or accidental event dispatching
    if (!CUSTOM_EVENTS.includes(event)) {
      logger.warn(`Attempted to dispatch unrecognizable event: ${event}`);
      return;
    }
    const customEventObject = new CustomEvent(event, { detail: data });
    target.dispatchEvent(customEventObject);
  }
  /**
   * Cleans up all subscribed event listeners.
   * call this when shutting during cleanup on page change
   */
  destroy() {
    // iterate through all tracked events and their handlers
    for (const [event, eventHandlerSet] of this.subscribedEvents) {
      eventHandlerSet.forEach(eventHandler => {
        window.removeEventListener(event, eventHandler);
      });
    }
    this.subscribedEvents.clear();
  }
}

export const globalEventSingleton = GlobalEventSingleton.getInstance();
