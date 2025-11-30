import type { StoreModels, StoreModelsKeys } from '@/types/storage';

type Subscriber<T> = (newVal: T, oldVal: T) => void;
export class StoreModel<Key extends StoreModelsKeys> {
  private subscribers: Map<'__any__' | keyof StoreModels[Key], Subscriber<StoreModels[Key]>[]> =
    new Map();
  private storeKey: Key;

  constructor(storeKey: Key) {
    this.storeKey = storeKey;
  }

  /**
   * Gets the full store object or a specific field value.
   *
   * @template Field
   * @param {?Field} [field] - Optional field to retrieve. If omitted, returns the whole store.
   * @returns {Promise<StoreModels[Key] | StoreModels[Key][Field] | null>}
   *   Returns `null` if the store is missing or an error occurs.
   */
  async get<Field extends keyof StoreModels[Key]>(
    field?: Field
  ): Promise<StoreModels[Key] | StoreModels[Key][Field] | null> {
    try {
      const result = await chrome.storage.local.get([this.storeKey]);
      const data = result[this.storeKey] as StoreModels[Key] | undefined;

      if (!data) return null;

      return field ? data[field] : data;
    } catch (err) {
      console.error(`Something went wrong while getting "${this.storeKey}"`, err);
      return null;
    }
  }

  /**
   * Updates storage with specified partial object
   *
   * @async
   * @param {K} partial of all targeted fields
   * @returns {Promise<void>}
   */
  async update<K extends Partial<StoreModels[Key]>>(partial: K): Promise<void> {
    const { [this.storeKey]: oldData = null } = await chrome.storage.local.get([this.storeKey]);
    if (!oldData) {
      // TECHDEBT(me/#5): ⚙️ safely handle corrupt or deleted storage after initialization
      // Issue: https://github.com/hassaneljebyly/SecondView/issues/5
      throw new Error(`Missing state for store "${this.storeKey}".`);
    }
    // merge old and new data,
    const newData: StoreModels[Key] = { ...oldData, ...partial };

    await chrome.storage.local.set({ [this.storeKey]: newData });

    const changedKeys = Object.keys(partial) as (keyof StoreModels[Key])[];
    for (const key of changedKeys) {
      this.emit(key, newData, oldData);
    }

    this.emit('__any__', newData, oldData);
  }

  async clear(): Promise<void> {
    await chrome.storage.local.remove([this.storeKey]);
  }

  /**
   * Handles registering subscribers to storage change
   *
   * @param {Subscriber<StoreModels[Key]>} callback takes (newVal, oldVal) as value
   * @param {K[]} [keys=[]] provide [] or no value to be notified when any change occurs.
   *  or provide ["specificField",...] to only listen to specified fields/keys
   * @returns {() => void}
   */
  onChange<K extends keyof StoreModels[Key]>(
    callback: Subscriber<StoreModels[Key]>,
    keys: K[] = []
  ): () => void {
    // determine which keys to watch:
    // - providing no keys or an empty array ([]), means:
    //   watch for any change in the storage, which is
    //   represent with the "__any__" key.
    // - otherwise, watch only the keys provided..
    const keyList: (K | '__any__')[] = keys.length === 0 ? ['__any__'] : keys;
    const uniqueKeys = new Set(keyList);

    // register callback for each key
    for (const key of uniqueKeys) {
      const existing = this.subscribers.get(key) ?? [];
      // prevent accidental duplicate subscriptions
      if (!existing.includes(callback)) {
        existing.push(callback);
        this.subscribers.set(key, existing);
      }
    }

    // return unsubscribe function
    return () => {
      for (const key of uniqueKeys) {
        const existing = this.subscribers.get(key);
        if (!existing) continue;

        const updated = existing.filter(cb => cb !== callback);
        this.subscribers.set(key, updated);

        // final cleanup: remove key entirely when no subscribers remain
        if (updated.length === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  /**
   * Notifies all subscribers to storage change
   *
   * @private
   * @param {(K | '__any__')} key takes specificField to watch for its change, or `__any__` to watch for any change
   * @param {StoreModels[Key]} newVal new storage value after it's updated
   * @param {StoreModels[Key]} oldVal old storage value before the update
   */
  private emit<K extends keyof StoreModels[Key]>(
    key: K | '__any__',
    newVal: StoreModels[Key],
    oldVal: StoreModels[Key]
  ) {
    // skip notifying subscribers if values didn't change
    if (key !== '__any__' && oldVal[key] === newVal[key]) return;
    const targetSubscribers = this.subscribers.get(key) || [];
    if (targetSubscribers) {
      for (const subscriber of targetSubscribers) {
        subscriber(newVal, oldVal);
      }
    }
  }

  /**
   * Ensures that a given store key exists in chrome.storage.local.
   *
   * If the store does not exist (e.g., first run or storage was cleared),
   * this method will initialize it with default values returned by the provided callback.
   *
   * @template Key - A valid key of StoreModels.
   * @param {Key} storeKey - The store key to check and initialize if missing.
   * @param {() => StoreModels[Key]} defaultValuesCallback -
   *   A callback that returns the default value for the store.
   *   This is used only if the store is missing.
   * @returns {Promise<void>} Resolves once the store exists or has been initialized.
   *
   * @example
   * await StoreModel.initializeStoreIfNoneExist('profile', () => createNewUserAndAccessKey());
   */
  static async initializeStoreIfNoneExist<Key extends StoreModelsKeys>(
    storeKey: Key,
    defaultValuesCallback: () => StoreModels[Key]
  ): Promise<void> {
    const result = await chrome.storage.local.get([storeKey]);
    if (!result[storeKey]) {
      await chrome.storage.local.set({ [storeKey]: defaultValuesCallback() });
    }
  }
}

//  mirror chrome.storage.local for dev
export class DevStoreModel<Key extends StoreModelsKeys> extends StoreModel<Key> {
  constructor(storeKey: Key) {
    super(storeKey);
  }

  private readFromLocalStorage(): StoreModels[Key] | null {
    try {
      const raw = window.localStorage.getItem(this['storeKey']);
      if (!raw) return null;
      return JSON.parse(raw) as StoreModels[Key];
    } catch {
      return null;
    }
  }

  private writeToLocalStorage(obj: StoreModels[Key]): void {
    window.localStorage.setItem(this['storeKey'], JSON.stringify(obj));
  }

  private removeFromLocalStorage(): void {
    window.localStorage.removeItem(this['storeKey']);
  }

  override async get<Field extends keyof StoreModels[Key]>(
    field?: Field
  ): Promise<StoreModels[Key] | StoreModels[Key][Field] | null> {
    const data = this.readFromLocalStorage();
    if (!data) return null;
    return field ? data[field] : data;
  }

  override async update<K extends Partial<StoreModels[Key]>>(partial: K): Promise<void> {
    const oldData = this.readFromLocalStorage();
    if (!oldData) {
      throw new Error(`Missing state for store "${this['storeKey']}".`);
    }

    const newData = { ...oldData, ...partial } as StoreModels[Key];

    this.writeToLocalStorage(newData);

    // Everything else stays the same (emit logic still works)
    const changedKeys = Object.keys(partial) as (keyof StoreModels[Key])[];
    for (const key of changedKeys) {
      this['emit'](key, newData, oldData);
    }

    this['emit']('__any__', newData, oldData);
  }

  override async clear(): Promise<void> {
    this.removeFromLocalStorage();
  }

  static override async initializeStoreIfNoneExist<Key extends StoreModelsKeys>(
    storeKey: Key,
    defaultValuesCallback: () => StoreModels[Key]
  ): Promise<void> {
    const raw = window.localStorage.getItem(storeKey);
    if (!raw) {
      window.localStorage.setItem(storeKey, JSON.stringify(defaultValuesCallback()));
    }
  }
}
