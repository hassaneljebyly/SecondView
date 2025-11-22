/**
 * Defines the shape of the data stored for the "profile" domain.
 * Only store-related code should rely on this.
 */
export type Profile = {
  userName: string;
  accessKey: string;
};

export type ProfileKeys = keyof Profile;

/**
 * Defines the shape of the data stored for the "settings" domain.
 */
export type Settings = {
  enabled: string;
  theme: string;
};

/**
 * Mapping of all store keys to their corresponding data shape.
 *
 * Internal use only: helps StoreModel infer types automatically.
 * Do NOT use directly for unrelated objects.
 */
export type StoreModels = {
  profile: Profile;
  settings: Settings;
};

/**
 * The valid keys that can be passed to StoreModel.
 *
 * Use this for type safety when creating a store:
 *   new StoreModel('profile') // ✅ allowed
 *   new StoreModel('invalidKey') // ❌ TypeScript will error
 */
export type StoreModelsKeys = keyof StoreModels;
