import type { StorageChangeEvent } from '@/types';
import type { GetValueResult, StoreModels, StoreState, StoreUpdater } from '@/types/storage';
import type { DeepNullable, NestedKeyOf, NestedValue } from '@shared/types/helpers';
import { getNestedValue, updateNestedValue } from '@shared/utils/helpers/objectHelpers';

import { globalEventSingleton } from './events';
import { logger } from './logger';
import { IS_DEV } from '../config/loggerConfig';

type Listener = (changes: { [key: string]: chrome.storage.StorageChange }) => void;

/**
 * Strongly-typed Chrome storage-backed store abstraction.
 * Provides typed get/update/set access with nested key support and change listeners.
 */
export class StoreModel<Key extends keyof StoreModels> {
  /** Storage key associated with this store */
  storeKey: Key;
  /** Registry of active change listeners for cleanup */
  listenersRegistry: Set<Listener>;

  /**
   * Creates a new StoreModel instance bound to a specific storage key.
   * @param storeKey - Key of the store inside chrome.storage.local
   */
  constructor(storeKey: Key) {
    this.storeKey = storeKey;
    this.listenersRegistry = new Set();
  }
  /**
   * Reads data from the store.
   *
   * @param fieldsSelector - Optional nested field path to retrieve (e.g 'user.id').
   * @returns Store state:
   *  - `{ status: 'uninitialized' }` if no value exists
   *  - `{ status: 'ready', storeValue }` when data is available
   *  - `{ status: 'error' }` on failure
   */
  async get<F extends NestedKeyOf<StoreModels[Key]> | undefined = undefined>(
    fieldsSelector?: F
  ): Promise<StoreState<GetValueResult<Key, F>>> {
    try {
      const res = await chrome.storage.local.get([this.storeKey]);
      if (!Object.keys(res).length) return { status: 'uninitialized' };
      const storeValue = fieldsSelector
        ? getNestedValue(res[this.storeKey], fieldsSelector)
        : res[this.storeKey];
      return { status: 'ready', storeValue };
    } catch (error) {
      logger.error(
        `Storage Error: Something went wrong while getting ${fieldsSelector} from ${this.storeKey}`,
        error
      );
      return { status: 'error' };
    }
  }
  /**
   * Updates a nested field using a functional updater.
   *
   * @param fieldsSelector - Nested field path to update.
   * @param updater - Function receiving previous value and returning new value.
   *
   * @remarks
   * - Throws if the field does not exist.
   * - Ensures read-modify-write consistency.
   */
  async update<T extends NestedKeyOf<StoreModels[Key]>>(
    fieldsSelector: T,
    updater: StoreUpdater<StoreModels[Key], T>
  ): Promise<void> {
    try {
      const result = await this.get();
      if (result.status === 'ready') {
        const { storeValue } = result;
        // @ts-expect-error - complaining about field, no idea why, works anyways
        const previousValue = getNestedValue(storeValue, fieldsSelector);
        if (previousValue === undefined)
          throw Error(
            `Couldn't continue updating ${this.storeKey} store, because ${fieldsSelector} doesn't exist`
          );
        const newVal = updater(previousValue as DeepNullable<NestedValue<StoreModels[Key], T>>);
        // @ts-expect-error - complaining about field, no idea why, works anyways
        const updatedVersion = updateNestedValue(storeValue, fieldsSelector, newVal);
        this.set(updatedVersion, storeValue);
      } else {
        throw Error(
          `Couldn't continue updating ${fieldsSelector} in ${this.storeKey} store, ${JSON.stringify(result)}`
        );
      }
    } catch (error) {
      logger.error(
        `Something went wrong while updating ${fieldsSelector} in ${this.storeKey} store`,
        error
      );
    }
  }

  async clear(): Promise<void> {
    await chrome.storage.local.remove([this.storeKey]);
  }

  /**
   * Overwrites the entire store value.
   *
   * @param updatedVersion - New store state to persist.
   */
  async set(newValue: DeepNullable<StoreModels[Key]>, _oldValue: DeepNullable<StoreModels[Key]>) {
    await chrome.storage.local.set({ [this.storeKey]: newValue });
  }
  /**
   * Subscribes to changes in the store or a specific nested field.
   *
   * @param fieldsSelector - Either '*' to watch the entire store or a nested field path.
   * @param handler - Callback fired when the watched value changes.
   *
   * @returns Cleanup function to unsubscribe the listener.
   *
   * @example
   * store.onChange('profile.name', (oldVal, newVal) => {})
   * store.onChange('*', (oldStore, newStore) => {})
   */
  onChange<
    Target extends '*' | NestedKeyOf<StoreModels[Key]>,
    T extends Target extends '*'
      ? DeepNullable<StoreModels[Key]>
      : NestedValue<StoreModels[Key], Target>,
  >(fieldsSelector: Target, handler: (oldVal: T, newVal: T) => void) {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      for (const [key, change] of Object.entries(changes)) {
        if (this.storeKey === key) {
          const { oldValue, newValue } = change;

          if (fieldsSelector === '*') {
            handler(oldValue as T, newValue as T);
          } else {
            const nestedOldValue = getNestedValue(oldValue, fieldsSelector) as T;
            const nestedNewValue = getNestedValue(newValue, fieldsSelector) as T;

            if (
              nestedOldValue !== undefined &&
              nestedNewValue !== undefined &&
              nestedNewValue !== nestedOldValue // skip if values are the same
            ) {
              handler(nestedOldValue, nestedNewValue);
            }
          }
        }
      }
    };

    this.listenersRegistry.add(listener);
    chrome.storage.local.onChanged.addListener(listener);

    return () => {
      chrome.storage.local.onChanged.removeListener(listener);
      this.listenersRegistry.delete(listener);
    };
  }
  /**
   * Removes all registered change listeners.
   *
   * @remarks
   * Intended for cleanup during teardown or disposal.
   */
  removeAllListeners() {
    this.listenersRegistry.forEach(listener => {
      chrome.storage.local.onChanged.removeListener(listener);
    });
    this.listenersRegistry.clear();
  }

  /**
   * Initializes a store with default values if it does not already exist.
   *
   * @param storeKey - Store key to initialize.
   * @param defaultValues - Lazy factory for default store state.
   */
  static async initializeStoreIfNoneExist<K extends keyof StoreModels>(
    storeKey: K,
    defaultValues: () => DeepNullable<StoreModels[K]>
  ) {
    try {
      const result = await chrome.storage.local.get([storeKey]);
      if (!result[storeKey] || !Object.keys(result[storeKey]).length) {
        await chrome.storage.local.set({ [storeKey]: defaultValues() });
      }
    } catch (error) {
      logger.error(`Failed to initialize store ${storeKey}`, error);
    }
  }
}

// ----------------------------------------
// Storage used during dev
// ----------------------------------------

export class LocalStorageStoreModel<Key extends keyof StoreModels> extends StoreModel<Key> {
  localListenersRegistry: Set<(e: Event) => void>;
  constructor(storeKey: Key) {
    super(storeKey);
    this.localListenersRegistry = new Set();
  }

  override async get<F extends NestedKeyOf<StoreModels[Key]> | undefined = undefined>(
    fieldsSelector?: F | undefined
  ): Promise<StoreState<GetValueResult<Key, F>>> {
    try {
      const raw = window.localStorage.getItem(this.storeKey);
      const res = JSON.parse(raw || '{}');
      if (!Object.keys(res).length) return { status: 'uninitialized' };
      const storeValue = fieldsSelector
        ? getNestedValue(res[this.storeKey], fieldsSelector)
        : res[this.storeKey];
      return { status: 'ready', storeValue };
    } catch (error) {
      logger.error(
        `Storage Error: Something went wrong while getting ${fieldsSelector} from ${this.storeKey}`,
        error
      );
      return { status: 'error' };
    }
  }
  // @ts-expect-error — TS generic variance limitation with recursive conditional types
  override async update<T extends NestedKeyOf<StoreModels[Key]>>(
    fieldsSelector: T,
    updater: StoreUpdater<StoreModels[Key], T>
  ): Promise<void> {
    try {
      const result = await this.get();
      if (result.status === 'ready') {
        const { storeValue } = result;
        // @ts-expect-error - complaining about field, no idea why, works anyways
        const previousValue = getNestedValue(storeValue, fieldsSelector);
        if (previousValue === undefined)
          throw Error(
            `Couldn't continue updating ${this.storeKey} store, because ${fieldsSelector} doesn't exist`
          );
        const newVal = updater(previousValue as DeepNullable<NestedValue<StoreModels[Key], T>>);
        // @ts-expect-error - complaining about field, no idea why, works anyways
        const updatedVersion = updateNestedValue(storeValue, fieldsSelector, newVal);
        this.set(updatedVersion, storeValue);
      } else {
        throw Error(
          `Couldn't continue updating ${fieldsSelector} in ${this.storeKey} store, ${JSON.stringify(result)}`
        );
      }
    } catch (error) {
      logger.error(
        `Something went wrong while updating ${fieldsSelector} in ${this.storeKey} store`,
        error
      );
    }
  }
  override async clear(): Promise<void> {
    window.localStorage.removeItem(this.storeKey);
  }
  override async set(
    newValue: DeepNullable<StoreModels[Key]>,
    _oldValue: DeepNullable<StoreModels[Key]>
  ): Promise<void> {
    globalEventSingleton.emit('LocalStorage:changed', window, {
      detail: { key: this.storeKey, oldValue: _oldValue, newValue },
    });
    window.localStorage.setItem(this.storeKey, JSON.stringify({ [this.storeKey]: newValue }));
  }

  override onChange<
    Target extends '*' | NestedKeyOf<StoreModels[Key]>,
    T extends Target extends '*'
      ? DeepNullable<StoreModels[Key]>
      : NestedValue<StoreModels[Key], Target>,
  >(fieldsSelector: Target, handler: (oldVal: T, newVal: T) => void): () => void {
    const listener = (e: Event) => {
      const { detail } = e as CustomEvent<StorageChangeEvent<Key>>;
      const { key, ...change } = detail;
      if (this.storeKey === key) {
        const { oldValue, newValue } = change;

        if (fieldsSelector === '*') {
          handler(oldValue as T, newValue as T);
        } else {
          // @ts-expect-error - complaining about field, no idea why, works anyways
          const nestedOldValue = getNestedValue(oldValue, fieldsSelector) as T;
          // @ts-expect-error - complaining about field, no idea why, works anyways
          const nestedNewValue = getNestedValue(newValue, fieldsSelector) as T;

          if (
            nestedOldValue !== undefined &&
            nestedNewValue !== undefined &&
            nestedNewValue !== nestedOldValue // skip if values are the same
          ) {
            handler(nestedOldValue, nestedNewValue);
          }
        }
      }
    };
    this.localListenersRegistry.add(listener);
    const storageEvent = globalEventSingleton.on('LocalStorage:changed', listener);

    return () => {
      storageEvent.disconnectEvent();
      this.localListenersRegistry.delete(listener);
    };
  }

  override removeAllListeners(): void {
    this.localListenersRegistry.forEach(listener => {
      window.removeEventListener('LocalStorage:changed', listener);
    });
    this.localListenersRegistry.clear();
  }

  static override async initializeStoreIfNoneExist<K extends keyof StoreModels>(
    storeKey: K,
    defaultValues: () => DeepNullable<StoreModels[K]>
  ): Promise<void> {
    try {
      const raw = window.localStorage.getItem(storeKey);
      const res = JSON.parse(raw || '{}');

      if (!res[storeKey] || !Object.keys(res[storeKey]).length) {
        window.localStorage.setItem(storeKey, JSON.stringify({ [storeKey]: defaultValues() }));
      }
    } catch (error) {
      logger.error(`Failed to initialize store ${storeKey}`, error);
    }
  }
}

export const profileStore = IS_DEV
  ? new LocalStorageStoreModel('profile')
  : new StoreModel('profile');
