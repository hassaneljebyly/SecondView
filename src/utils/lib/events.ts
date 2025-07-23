import { logger } from './logger';

const customEvents = ['form:close', 'form:open'] as const;

type CustomEventMap = (typeof customEvents)[number];

type GlobalEventNames = keyof WindowEventMap | CustomEventMap;

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

  on(
    event: GlobalEventNames,
    eventHandler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    // register the event listener with the browser
    window.addEventListener(event, eventHandler, options);
    // get existing handlers for this event or create a new Set
    const currentSubscribedEvents = this.subscribedEvents.get(event) ?? new Set();
    currentSubscribedEvents.add(eventHandler);
    this.subscribedEvents.set(event, currentSubscribedEvents);
    const disconnect = () => {
      // clear event
      window.removeEventListener(event, eventHandler);
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

  emit(event: CustomEventMap, data?: CustomEventInit<unknown>) {
    // runtime validation to prevent malicious or accidental event dispatching
    if (!customEvents.includes(event)) {
      logger.warn(`Attempted to dispatch unrecognizable event: ${event}`);
      return;
    }
    const customEventObject = new CustomEvent(event, { detail: data });
    window.dispatchEvent(customEventObject);
  }
  // call this when shutting during cleanup on page change
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
