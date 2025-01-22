import { List, indexOf, sortBy } from 'lodash'

export function sortByKeys<T, K extends keyof T>(
  collection: List<T>,
  keys: unknown[],
  keyProperty: K = 'id' as K,
): T[] {
  return sortBy(collection, (col) => indexOf(keys, col[keyProperty]))
}

export function filterBy<T, K extends keyof T>(
  collection: T[],
  values: Partial<T>[],
  keyProperty: K,
): T[] {
  return collection.filter((col) =>
    values.some((value) => col[keyProperty] === value[keyProperty]),
  )
}
