import { GlobalFilterState } from '@tanstack/react-table'
import { compact, isEmpty, mapValues, values } from 'lodash'

import { useTable } from '../data-table.context'

export function useTableGlobalFilter<
  TGlobalFilterValue = GlobalFilterState[string],
>(queryField?: string) {
  const { table } = useTable()

  const globalFilter = table.getState().globalFilter as GlobalFilterState

  return {
    globalFilter,
    globalFilterValue: queryField
      ? (globalFilter?.[queryField] as TGlobalFilterValue)
      : undefined,
    hasFilter: () => !isEmpty(compact(values(globalFilter))),
    setGlobalFilter: (values: GlobalFilterState) => {
      table.setGlobalFilter(values)
    },
    setGlobalFilterValue: (value: TGlobalFilterValue) => {
      if (!queryField) return
      table.setGlobalFilter({ [queryField]: isEmpty(value) ? null : value })
    },
    clearGlobalFilter: () => {
      table.setGlobalFilter((prev: GlobalFilterState) =>
        mapValues(prev, () => null),
      )
    },
    clearGlobalFilterValue: () => {
      if (!queryField) return
      table.setGlobalFilter({ [queryField]: null })
    },
  }
}
