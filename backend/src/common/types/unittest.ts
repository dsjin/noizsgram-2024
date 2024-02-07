export type AnyType<T, J> = {
  [P in keyof T]?: J
}
