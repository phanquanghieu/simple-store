import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

export enum E_COLUMN_ID {
  SELECT = 'SELECT',
  ACTION = 'ACTION',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IFilterDef<IQuery = any> = {
  queryField: Extract<keyof IQuery, string>
  dataType: 'string' | 'string[]' | 'number' | 'number[]'
}

export interface IColumnDefConfig<IData> {
  showSelectColumn?: boolean
  showActionEdit?: boolean
  showActionDelete?: boolean
  actionEditLink?: (row: IData) => string
}

export interface IBulkActionDef {
  label?: TMessageKey
  icon?: ReactNode
  type: string
}

export interface IBulkAction {
  rowIds: string[]
  type: string
}

export interface IRowActionDef<IData> {
  icon?: ReactNode
  type: string
  actionLink?: (row: IData) => string
}

export interface IRowAction<TData> {
  row: Row<TData>
  type: string
}
