import type { NoteResponse } from '@/api/types/notes';

export type CacheConfig = {
  key: string;
  ttl: 'navigation' | 'session';
};

export type StoredCacheEntry<T> = {
  value: T;
  ttl: 'navigation' | 'session';
};

/**
 * Global cache singleton.
 * Stores entries in-memory for the current runtime.
 */
export class GlobalCacheSingleton {
  /**
   * Internal map for cache entries.
   * @type {Map<string, StoredCacheEntry<unknown>>}
   * @private
   */
  private readonly cacheMap: Map<string, StoredCacheEntry<unknown>>;
  /**
   * Internal map for cache subscribers.
   * Each key can have multiple subscribers.
   *
   * @private
   */
  cacheSubscriberMap: Map<string, Array<(oldValue: unknown, newValue: unknown) => void>> =
    new Map();

  /**
   * Singleton instance.
   * @type {GlobalCacheSingleton | null}
   */
  static instance: GlobalCacheSingleton | null = null;

  /**
   * Private constructor to prevent direct instantiation.
   * @private
   */
  private constructor() {
    this.cacheMap = new Map();
  }

  /**
   * Returns the singleton instance.
   * @returns {GlobalCacheSingleton}
   */
  static getInstance(): GlobalCacheSingleton {
    if (GlobalCacheSingleton.instance) {
      return GlobalCacheSingleton.instance;
    }
    GlobalCacheSingleton.instance = new GlobalCacheSingleton();
    return GlobalCacheSingleton.instance;
  }

  /**
   * Retrieves a value from the cache.
   *
   * @template T
   * @param {string} key - Cache key.
   * @returns {T | undefined} The cached value or undefined if not found.
   */
  get<T>(key: string): T | undefined {
    return this.cacheMap.get(key)?.value as T | undefined;
  }

  /**
   * Stores a value in the cache.
   * Emits cache change
   * @template T
   * @param {CacheConfig} config - Cache configuration.
   * @param {T} value - Value to cache.
   */
  set<T>(config: CacheConfig, value: T): void {
    const oldValue = this.get<T>(config.key);

    this.cacheMap.set(config.key, { value, ttl: config.ttl });
    this.emitChange(config.key, oldValue, value);
  }

  /**
   * registers handlers for cache change
   *
   * @template T
   * @param {CacheConfig['key']} key same cache key in cache config used for get and set
   * @param {(oldValue: T) => void} onChangeHandler onChange handler, takes old cache value as param
   * @returns {() => void} function to unsubscribe from cache store
   */
  onChange<T>(
    key: CacheConfig['key'],
    onChangeHandler: (oldValue: T, newValue: T) => void
  ): () => void {
    const handler = onChangeHandler as (oldValue: unknown) => void;

    const existingSubs = this.cacheSubscriberMap.get(key) ?? [];

    existingSubs.push(handler);
    this.cacheSubscriberMap.set(key, existingSubs);

    // Cleanup / unsubscribe
    return () => {
      const subs = this.cacheSubscriberMap.get(key);
      if (!subs) return;

      const index = subs.indexOf(handler);
      if (index !== -1) {
        subs.splice(index, 1);
      }

      // Optional: avoid keeping empty arrays around
      if (subs.length === 0) {
        this.cacheSubscriberMap.delete(key);
      }
    };
  }

  /**
   * Emits a change event to all subscribers of the given cache key.
   *
   * @private
   */
  private emitChange<T>(key: CacheConfig['key'], oldValue: T, newValue: T): void {
    const subscribers = this.cacheSubscriberMap.get(key);

    if (!subscribers || subscribers.length === 0) {
      return;
    }

    subscribers.forEach(handler => {
      (handler as (oldValue: T, newValue: T) => void)(oldValue, newValue);
    });
  }

  clearCacheByKey(key: CacheConfig['key']) {
    this.cacheMap.delete(key);
  }

  /**
   * Clears cache entries and their subscribers by target scope.
   *
   * - `navigation`: clears navigation-scoped cache entries
   * - `session`: clears session-scoped cache entries
   * - `*`: clears all cache entries and all subscribers
   *
   * When a cache entry is removed, all associated subscribers
   * are also removed to prevent memory leaks.
   */
  clearCacheFor(target: 'navigation' | 'session' | '*'): void {
    if (target === '*') {
      this.cacheMap.clear();
      this.cacheSubscriberMap.clear();
      return;
    }

    for (const [key, entry] of this.cacheMap.entries()) {
      if (entry.ttl === target) {
        this.cacheMap.delete(key);
        this.cacheSubscriberMap.delete(key);
      }
    }
  }
}

export type CachedNotesMap = Map<NoteResponse['id'], NoteResponse>;
export const globalCacheSingleton = GlobalCacheSingleton.getInstance();
