/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    sizePercentage?: number
  }
  type GlobalFilterState = Record<
    string,
    string[] | string | number[] | number | null | undefined
  >
}
