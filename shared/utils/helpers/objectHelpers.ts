import type { NestedKeyOf, NestedValue } from '@shared/types/helpers';

/**
 * Safely get a nested value from an object using a dot-separated path.
 * Stops only if the key doesn't exist, not for falsy values like 0 or ''.
 */
export function getNestedValue<T extends object, K extends NestedKeyOf<T>>(
  obj: T,
  path: K
): NestedValue<T, K> | undefined {
  const keys = path.split('.');
  return keys.reduce((prev, cur, idx) => {
    // If the current key doesn't exist, stop and return undefined
    if (typeof prev !== 'object' || prev === null || !(cur in prev)) return undefined;

    // @ts-expect-error: TypeScript cannot guarantee that 'cur' exists on 'prev' or what type it has,
    // but we know for sure that our pathSelector keys exist in the object at runtime.
    if (idx === keys.length - 1) return prev[cur];

    // @ts-expect-error Same reason as above, TS cannot infer the type of nested keys here
    return prev[cur];
  }, obj) as NestedValue<T, K> | undefined;
}

/**
 * Safely set a nested value in an object using a dot-separated path.
 * Returns a new updated object (does not mutate original).
 */
export function updateNestedValue<T extends object, K extends NestedKeyOf<T>>(
  obj: T,
  path: K,
  value: NestedValue<T, K>
): T {
  const keys = path.split('.');
  const result = structuredClone(obj);

  keys.reduce((prev, cur, idx) => {
    if (typeof prev !== 'object' || prev === null) return prev;

    if (idx === keys.length - 1) {
      // @ts-expect-error: TS cannot infer dynamic deep assignment
      prev[cur] = value;
      return prev;
    }

    // @ts-expect-error: TS cannot infer dynamic deep access
    if (!(cur in prev) || typeof prev[cur] !== 'object') {
      return result;
    }

    // @ts-expect-error: TS cannot infer dynamic deep access
    return prev[cur];
  }, result as unknown);

  return result;
}
