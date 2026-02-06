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
   *
   * @template T
   * @param {CacheConfig} config - Cache configuration.
   * @param {T} value - Value to cache.
   */
  set<T>(config: CacheConfig, value: T): void {
    this.cacheMap.set(config.key, { value, ttl: config.ttl });
  }

  /**
   * Clears cache entries for the specified target.
   *
   * @param {'navigation' | 'session' | '*'} target - Target cache to clear.
   */
  clearCacheFor(target: 'navigation' | 'session' | '*'): void {
    if (target === '*') {
      this.cacheMap.clear();
      return;
    }

    for (const [key, entry] of this.cacheMap.entries()) {
      if (entry.ttl === target) {
        this.cacheMap.delete(key);
      }
    }
  }
}

export const globalCacheSingleton = GlobalCacheSingleton.getInstance();
