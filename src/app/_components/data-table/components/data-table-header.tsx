'use client'

import { useTranslations } from 'next-intl'
import { LuArrowDown, LuArrowUp, LuChevronsUpDown } from 'react-icons/lu'

import { HeaderContext } from '@tanstack/react-table'
import { isUndefined } from 'lodash'

import { E_COLUMN_ID } from '~/app/_components/data-table'

import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'

export function DataTableHeader<IData>({
  column,
  table,
}: HeaderContext<IData, unknown>) {
  const t = useTranslations()

  if (column.id === E_COLUMN_ID.SELECT) {
    return (
      <Checkbox
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(!!checked)
        }
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        className='mx-1'
      />
    )
  }

  const headerTitle = column.columnDef.meta?.headerTitle
  const title = isUndefined(headerTitle)
    ? column.id
    : headerTitle && t(headerTitle)

  if (column.getCanSort()) {
    const sortDefaultColumns =
      table.options.meta?.sortDefaults?.map((s) => s[0]) ?? []
    const isSortDefaultColumn = sortDefaultColumns.includes(column.id)
    const currSort = column.getIsSorted()

    return (
      <Button
        onClick={
          isSortDefaultColumn
            ? (e) =>
                column.toggleSorting(
                  currSort === 'asc' ? true : false,
                  table.options.isMultiSortEvent?.(e),
                )
            : column.getToggleSortingHandler()
        }
        className='-ml-2 gap-1 px-2'
        variant={'ghost'}
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
