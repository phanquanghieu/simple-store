/* eslint-disable @typescript-eslint/no-unused-vars */
import { RowData } from '@tanstack/react-table'

import {
  IBulkAction,
  IBulkActionDef,
  IFilterDef,
  IRowAction,
  IRowActionDef,
} from '../_components/data-table'
import { BadgeProps } from '../_components/ui/badge'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    sortDefaults?: string[][]
    filterDefs?: IFilterDef[]
    bulkActionDefs?: IBulkActionDef[]
    setBulkAction?: (bulkAction: IBulkAction) => void
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    sizePercent?: number
    headerTitle?: TMessageKey | null
    cellType?: 'text' | 'datetime' | 'date' | 'link' | 'money' | 'badge'
    cellLink?: (row: TData) => string
    cellAction?: {
      rowActionDefs?: IRowActionDef<TData>[]
      setRowAction?: (row: IRowAction<TData>) => void
    }
    cellBadge?: Record<
      string,
      {
        variant: BadgeProps['variant']
        label: TMessageKey
      }
    >
  }
  type GlobalFilterState = Record<
    string,
    string[] | string | number[] | number | null | undefined
  >
}
