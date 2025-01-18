import { List, indexOf, sortBy } from 'lodash'

export function sortByKeys<T>(
  collection: List<T>,
  keys: unknown[],
  keyProperty: keyof T = 'id' as keyof T,
): T[] {
  return sortBy(collection, (col) => indexOf(keys, col[keyProperty]))
}
