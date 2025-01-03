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

export enum E_COMMON_BULK_ACTION_TYPE {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface IBulkActionDef {
  label?: string
  icon?: ReactNode
  type: E_COMMON_BULK_ACTION_TYPE | string
}

export interface IBulkAction {
  rowIds: string[]
  type: E_COMMON_BULK_ACTION_TYPE | string
}

export enum E_COMMON_ROW_ACTION_TYPE {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface IRowActionDef<IData> {
  icon?: ReactNode
  type: E_COMMON_BULK_ACTION_TYPE | string
  actionLink?: (row: IData) => string
}

export interface IRowAction<TData> {
  row: Row<TData>
  type: E_COMMON_ROW_ACTION_TYPE | string
}
