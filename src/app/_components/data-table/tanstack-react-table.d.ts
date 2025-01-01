/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react'

import { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    sizePercent?: number
    headerTitle?: ReactNode
  }
  type GlobalFilterState = Record<
    string,
    string[] | string | number[] | number | null | undefined
  >
}
