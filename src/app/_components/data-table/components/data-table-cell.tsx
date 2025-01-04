'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { LuPen, LuTrash } from 'react-icons/lu'

import { CellContext } from '@tanstack/react-table'

import {
  E_COLUMN_ID,
  E_COMMON_ROW_ACTION_TYPE,
} from '~/app/_components/data-table/data-table.interface'

import { useThrottledCallback } from '~/app/_hooks/use-throttled-callback'

import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'

export function DataTableCell<IData>(props: CellContext<IData, unknown>) {
  const { column, getValue, row } = props

  if (column.id === E_COLUMN_ID.SELECT) {
    return (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className='mx-1'
      />
    )
  }

  if (column.id === E_COLUMN_ID.ACTION) {
    return <DataTableCellAction {...props} />
  }

  const meta = column.columnDef.meta

  if (meta?.cellType === 'link') {
    return (
      <Link href={meta?.cellLink?.(row) ?? '#'}>
        <Button variant={'link'} className='pl-0'>
          {getValue<string>()}
        </Button>
      </Link>
    )
  }

  if (meta?.cellType === 'datetime') {
    return (
      <div className='w-32'>
        {Intl.DateTimeFormat('vi', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(getValue<string>()))}
      </div>
    )
  }

  if (meta?.cellType === 'money') {
    return (
      <div>
        {Intl.NumberFormat('en', {
          style: 'currency',
          currency: 'USD',
        }).format(parseFloat(getValue<string>()))}
      </div>
    )
  }

  if (meta?.cellType === 'badge') {
    return (
      <Badge variant={meta.cellBadge?.[getValue<string>()] ?? 'secondary'}>
        {getValue<string>()}
      </Badge>
    )
  }

  return (
    <div className='truncate' style={{ maxWidth: column.columnDef.maxSize }}>
      {getValue<string>()}
    </div>
  )
}

function DataTableCellAction<IData>({
  column,
  row,
}: CellContext<IData, unknown>) {
  const { rowActionDefs, setRowAction } =
    column.columnDef.meta?.cellAction ?? {}

  return (
    <div className='-mx-1 flex'>
      {rowActionDefs?.map(({ type, icon, actionLink }) => {
        const Icon = DEFAULT_ROW_ACTION_ICON[type] ?? icon

        if (actionLink) {
          return (
            <Link key={type} href={actionLink?.(row.original) ?? '#'}>
              <Button
                size={'icon'}
                variant={'ghost'}
                className='hover:bg-secondary'
              >
                {Icon}
              </Button>
            </Link>
          )
        } else {
          return (
            <DataTableCellActionButton
              key={type}
              Icon={Icon}
              onClick={() => {
                setRowAction?.({ row, type: type })
              }}
            />
          )
        }
      })}
    </div>
  )
}

function DataTableCellActionButton({
  Icon,
  onClick,
}: {
  Icon: ReactNode
  onClick: () => void
}) {
  const onClickThrottled = useThrottledCallback(onClick, 2000)
  return (
    <Button
      size={'icon'}
      variant={'ghost'}
      className='hover:bg-secondary'
      onClick={onClickThrottled}
    >
      {Icon}
    </Button>
  )
}

const DEFAULT_ROW_ACTION_ICON: Record<
  E_COMMON_ROW_ACTION_TYPE | string,
  ReactNode
> = {
  UPDATE: <LuPen className='text-info' />,
  DELETE: <LuTrash className='text-destructive' />,
}
