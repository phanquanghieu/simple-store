import { useCallback, useMemo, useState } from 'react'

import { ColumnDef, RowSelectionState, TableMeta } from '@tanstack/react-table'

import {
  E_COLUMN_ID,
  IBulkAction,
  IBulkActionDef,
  IFilterDef,
  IRowAction,
  IRowActionDef,
} from '~/app/_components/data-table/data-table.interface'

export interface IDataTableConfig<IData> {
  columnDefs: ColumnDef<IData>[]
  showSelectColumn?: boolean
  sortDefaults?: string[][]
  filterDefs?: IFilterDef[]
  bulkActionDefs?: IBulkActionDef[]
  rowActionDefs?: IRowActionDef<IData>[]
}

export function useDataTable<IData>({
  columnDefs,
  showSelectColumn = true,
  sortDefaults,
  filterDefs,
  bulkActionDefs,
  rowActionDefs,
}: IDataTableConfig<IData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [bulkAction, setBulkAction] = useState<IBulkAction | undefined>()
  const [rowAction, setRowAction] = useState<IRowAction<IData> | undefined>()

  const columns = useMemo(() => {
    const columns = [...columnDefs]

    if (showSelectColumn) {
      columns.unshift({
        id: E_COLUMN_ID.SELECT,
        size: 40,
      })
    }

    const countAction = rowActionDefs?.length ?? 0
    const showActionColumn = countAction > 0

    if (showActionColumn) {
      const actionColumn: ColumnDef<IData> = {
        id: E_COLUMN_ID.ACTION,
        size: countAction * 36 + 8,
        meta: {
          headerTitle: null,
          cellAction: {
            rowActionDefs,
            setRowAction,
          },
        },
      }

      columns.push(actionColumn)
    }

    return columns
  }, [columnDefs, showSelectColumn, rowActionDefs])

  const meta = useMemo(() => {
    const meta: TableMeta<IData> = {
      sortDefaults,
      filterDefs,
      bulkActionDefs,
      setBulkAction,
    }

    return meta
  }, [sortDefaults, filterDefs, bulkActionDefs])

  const resetRowSelection = useCallback(() => setRowSelection({}), [])

  const resetRowAction = useCallback(() => setRowAction(undefined), [])

  const resetBulkAction = useCallback(() => setBulkAction(undefined), [])

  return {
    columns,
    meta,
    rowSelection,
    setRowSelection,
    resetRowSelection,
    rowAction,
    setRowAction,
    resetRowAction,
    bulkAction,
    setBulkAction,
    resetBulkAction,
  }
}
