'use client'

import { LuArrowDown, LuArrowUp, LuChevronsUpDown } from 'react-icons/lu'

import { HeaderContext } from '@tanstack/react-table'
import { isUndefined } from 'lodash'

import { E_COLUMN_ID } from '~/app/_interfaces/data-table'

import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'

export function DataTableHeader<IData>({
  column,
  header,
  table,
}: HeaderContext<IData, unknown>) {
  if (column.id === E_COLUMN_ID.SELECT) {
    return (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(!!checked)
        }
        className='mx-1'
      />
    )
  }

  const headerTitle = column.columnDef.meta?.headerTitle
  const title = isUndefined(headerTitle) ? column.id : headerTitle

  if (column.getCanSort()) {
    return (
      <Button
        variant={'ghost'}
        className='-ml-2 gap-1 px-2'
        onClick={header.column.getToggleSortingHandler()}
      >
        {title}
        {column.getIsSorted() === 'desc' ? (
          <LuArrowDown />
        ) : column.getIsSorted() === 'asc' ? (
          <LuArrowUp />
        ) : (
          <LuChevronsUpDown />
        )}
      </Button>
    )
  } else {
    return <div>{title}</div>
  }
}
