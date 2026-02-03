export type Entries<T> = [keyof T, T[keyof T]];

export type DeepNullable<T> = T extends (infer U)[]
  ? DeepNullable<U>[] | null
  : T extends object
    ? { [K in keyof T]: DeepNullable<T[K]> }
    : T | null;

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends readonly unknown[]
    ? `${Key}`
    : ObjectType[Key] extends object
      ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
      : `${Key}`;
}[keyof ObjectType & (string | number)];

export type NestedValue<
  ObjectType extends object,
  Path extends string,
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof ObjectType
    ? ObjectType[Key] extends object
      ? NestedValue<ObjectType[Key], Rest>
      : never
    : never
  : Path extends keyof ObjectType
    ? ObjectType[Path]
    : never;
