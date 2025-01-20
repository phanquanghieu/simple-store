import { isEqual } from 'lodash'
import { parseAsInteger, useQueryStates } from 'nuqs'

export function useQueryList(sortDefaults?: string[][]) {
  return useQueryStates({
    page: parseAsInteger.withDefault(1),
    size: parseAsInteger.withDefault(10),
    sort: {
      defaultValue: sortDefaults,
      parse: (sortRaw) => {
        const sort = sortRaw
          .split(',')
          .map((sRaw) => {
            const sort: string[] = sRaw.split(':')
            if (sort[1]) sort[1] = sort[1]?.toLowerCase()
            return sort
          })
          .filter((sort) => ['asc', 'desc'].includes(sort[1]))

        return sort.length ? sort : sortDefaults
      },
      serialize: (sort: string[][]) => {
        return sort.map((s) => s.join(':')).join(',')
      },
      eq: isEqual,
    },
  })
}
