export type WithoutArray<T> = T extends (infer U)[] ? U : T;
