import type { ApiResponse } from './responses';

export type User = {
  user: {
    id: string; // Unique user ID
    username: string; // Login name
    accessKey: string; // API access key
    signingKey: string; // Key for signing requests
    userNameChanged: boolean; // Indicates if username was changed
    userReputation: number;
  };
};

export type SyncProfilePayload = {
  username: string;
  accessKey: string;
};

// Standard API response wrapping a User
export type CreateUserResponse = ApiResponse<User>;
export type SyncUserResponse = ApiResponse<Omit<User, 'accessKey'>>;
