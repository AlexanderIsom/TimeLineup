export type WithoutArray<T> = T extends (infer U)[] ? U : T;
export type NotUndefined<T> = T extends undefined ? never : T;