// must be able to get data
// must be able to save data
// must be able to update data
// must be able to delete data
// must be able to clear All data
// must be able to listen to data change, run listener with new data and old data as params

type SubWatch<T> = (newVal: T, oldVal: T) => void;
export class StorageStore<T extends Record<string, unknown>> {
  subscribers: Map<'__any__' | keyof T, SubWatch<T>[]>;
  constructor() {
    this.subscribers = new Map();
  }
  // get all or part of data
  getData<K extends keyof T>(key?: K) {}
  setData<K extends Partial<T>>(value: K) {
    const targetFields = Object.keys(value) as (keyof T)[];
    for (const field of targetFields) {
      this.broadcastChange(field, value, value);
    }
  }
  clearStorage() {}
  onChange<K extends keyof T>(callback: SubWatch<T>, keys: K[] = []): () => void {
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

  private broadcastChange<K extends keyof T>(key: K, newVal: T, oldVal: T) {
    const targetSubscribers = this.subscribers.get(key) || [];
    const anySubscribers = this.subscribers.get('__any__') || [];
    if (targetSubscribers) {
      for (const subscriber of [...targetSubscribers, ...anySubscribers]) {
        subscriber(newVal, oldVal);
      }
    }
  }
}

type Profile = {
  userName: string;
  accessKey: string;
};

export const profileStore = new StorageStore<Profile>();
