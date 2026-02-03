import type { User } from '@/api/types/user';
import type { DeepNullable, NestedKeyOf, NestedValue } from '@shared/types/helpers';

/**
 * Defines the shape of the data stored for the "settings" domain.
 */
export type Settings = {
  enabled: string;
  theme: string;
};

export type StoreState<T> =
  | { status: 'uninitialized' }
  | { status: 'ready'; storeValue: T }
  | { status: 'error' };

export type StoreModels = {
  profile: User;
  settings: Settings;
};

export type StoreUpdater<Obj extends object, Path extends string> = (
  prev: DeepNullable<NestedValue<Obj, Path>>
) => NestedValue<Obj, Path>;

export type GetValueResult<
  T extends keyof StoreModels,
  F extends NestedKeyOf<StoreModels[T]> | undefined = undefined,
> = F extends undefined
  ? DeepNullable<StoreModels[T]>
  : NestedValue<StoreModels[T], F & string> | null;
