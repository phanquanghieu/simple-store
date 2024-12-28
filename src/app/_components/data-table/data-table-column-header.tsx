'use client'

import { LuArrowDown, LuArrowUp, LuChevronsUpDown } from 'react-icons/lu'

import { HeaderContext } from '@tanstack/react-table'

import { Button } from '../ui/button'

export function DataTableColumnHeader<TData>({
  header,
  column,
}: HeaderContext<TData, unknown>) {
  if (column.getCanSort()) {
    return (
      <div>
        <Button
          variant={'ghost'}
          className='-ml-2 gap-1 px-2'
          onClick={header.column.getToggleSortingHandler()}
        >
          {column.id}
          {column.getCanSort() && column.getIsSorted() === 'desc' ? (
            <LuArrowDown />
          ) : column.getIsSorted() === 'asc' ? (
            <LuArrowUp />
          ) : (
            <LuChevronsUpDown />
          )}
        </Button>
      </div>
    )
  } else {
    return <div>{column.id}</div>
  }
}
