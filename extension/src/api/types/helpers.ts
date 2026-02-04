export type Spread<A, B> = Omit<A, keyof B> & B; // basically flattens two object types
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
