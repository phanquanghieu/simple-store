import { useMemo } from 'react'

import {
  Parser,
  parseAsArrayOf,
  parseAsFloat,
  parseAsString,
  useQueryStates,
} from 'nuqs'

export function useQueryFilter<IQuery>(filterDefs: IFilterDef<IQuery>[] = []) {
  const parseAsFilters = useMemo(() => {
    return filterDefs.reduce(
      (parseAsFilters, { queryField, dataType }) => {
        if (dataType === 'string') {
          parseAsFilters[queryField] = parseAsString
        }
        if (dataType === 'string[]') {
          parseAsFilters[queryField] = parseAsArrayOf(parseAsString, ',')
        }
        if (dataType === 'number') {
          parseAsFilters[queryField] = parseAsFloat
        }
        if (dataType === 'number[]') {
          parseAsFilters[queryField] = parseAsArrayOf(parseAsFloat, ',')
        }
        return parseAsFilters
      },
      {} as Record<
        string,
        Parser<string> | Parser<string[]> | Parser<number> | Parser<number[]>
      >,
    )
  }, [filterDefs])

  return useQueryStates(parseAsFilters)
}
