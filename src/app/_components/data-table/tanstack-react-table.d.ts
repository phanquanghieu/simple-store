/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react'

import { Row, RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    sizePercent?: number
    headerTitle?: ReactNode
    cellType?: 'text' | 'datetime' | 'date' | 'link' | 'money'
    cellLink?: (row: Row<TData>) => string
  }
  type GlobalFilterState = Record<
    string,
    string[] | string | number[] | number | null | undefined
  >
}
