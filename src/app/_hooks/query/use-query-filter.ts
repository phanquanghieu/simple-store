import { useMemo } from 'react'

import {
  Parser,
  parseAsArrayOf,
  parseAsFloat,
  parseAsString,
  useQueryStates,
} from 'nuqs'

import { IFilterDef } from '~/app/_components/data-table'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQueryFilter<IQuery = any>(
  filterDefs: IFilterDef<IQuery>[] = [],
) {
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
        Extract<keyof IQuery, string>,
        Parser<string> | Parser<string[]> | Parser<number> | Parser<number[]>
      >,
    )
  }, [filterDefs])

  return useQueryStates(parseAsFilters)
}
