import { Context, createContext, useContext } from 'react'

import { Table } from '@tanstack/react-table'

interface IDataTableContext<IData> {
  table: Table<IData>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataTableContext = createContext<IDataTableContext<any> | null>(
  null,
)

export function useTable<IData = unknown>() {
  const context = useContext<IDataTableContext<IData>>(
    DataTableContext as Context<IDataTableContext<IData>>,
  )
  if (!context) {
    throw new Error('useTable must be used within a DataTableProvider.')
  }

  return context
}
