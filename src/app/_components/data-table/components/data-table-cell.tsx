'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

import { CellContext } from '@tanstack/react-table'

import { E_COLUMN_ID } from '~/app/_components/data-table/data-table.interface'

import { useThrottledCallback } from '~/app/_hooks/common/use-throttled-callback'

import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'

export function DataTableCell<IData>(props: CellContext<IData, unknown>) {
  const { column, getValue, row } = props

  const t = useTranslations()

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
      <Link href={meta?.cellLink?.(row.original) ?? '#'}>
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
    const metaCellBadge = meta.cellBadge?.[getValue<string>()]
    return (
      <Badge variant={metaCellBadge?.variant ?? 'secondary'}>
        {metaCellBadge && t(metaCellBadge.label)}
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
        if (actionLink) {
          return (
            <Link key={type} href={actionLink?.(row.original) ?? '#'}>
              <Button
                size={'icon'}
                variant={'ghost'}
                className='hover:bg-secondary'
              >
                {icon}
              </Button>
            </Link>
          )
        } else {
          return (
            <DataTableCellActionButton
              key={type}
              onClick={() => {
                setRowAction?.({ row, type: type })
              }}
            >
              {icon}
            </DataTableCellActionButton>
          )
        }
      })}
    </div>
  )
}

function DataTableCellActionButton({
  children,
  onClick,
}: PropsWithChildren<{ onClick: () => void }>) {
  const onClickThrottled = useThrottledCallback(onClick, 2000)
  return (
    <Button
      size={'icon'}
      variant={'ghost'}
      className='hover:bg-secondary'
      onClick={onClickThrottled}
    >
      {children}
    </Button>
  )
}
