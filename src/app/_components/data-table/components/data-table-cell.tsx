'use client'

import Link from 'next/link'

import { CellContext } from '@tanstack/react-table'

import { E_COLUMN_ID } from '~/app/_interfaces/data-table'

import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'

export function DataTableCell<IData>({
  cell,
  column,
  getValue,
  row,
  table,
}: CellContext<IData, unknown>) {
  if (column.id === E_COLUMN_ID.SELECT) {
    return (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className='mx-1'
      />
    )
  }
  if (column.columnDef.meta?.cellType === 'link') {
    return (
      <Link href={column.columnDef.meta?.cellLink?.(row) ?? '#'}>
        <Button variant={'link'} className='pl-0'>
          {getValue<string>()}
        </Button>
      </Link>
    )
  }

  if (column.columnDef.meta?.cellType === 'datetime') {
    return (
      <div className='w-32'>
        {Intl.DateTimeFormat('vi', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(getValue<string>()))}
      </div>
    )
  }

  if (column.columnDef.meta?.cellType === 'money') {
    return (
      <div>
        {Intl.NumberFormat('en', {
          style: 'currency',
          currency: 'USD',
        }).format(parseFloat(getValue<string>()))}
      </div>
    )
  }

  return (
    <div className='truncate' style={{ maxWidth: column.columnDef.maxSize }}>
      {getValue<string>()}
    </div>
  )
}
