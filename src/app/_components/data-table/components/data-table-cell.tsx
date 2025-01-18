'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

import { CellContext } from '@tanstack/react-table'

import { E_COLUMN_ID } from '~/app/_components/data-table'

import { useThrottledCallback } from '~/app/_hooks/common/use-throttled-callback'
import { useCurrency } from '~/app/_hooks/use-currency'
import { useDatetime } from '~/app/_hooks/use-datetime'

import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'

export function DataTableCell<IData>(props: CellContext<IData, unknown>) {
  const { column, getValue, row } = props

  if (column.id === E_COLUMN_ID.SELECT) {
    return (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
        className='mx-1'
      />
    )
  }

  if (column.id === E_COLUMN_ID.ACTION) {
    return <DataTableCellAction {...props} />
  }

  const meta = column.columnDef.meta

  if (meta?.cellType === 'link') {
    return <DataTableCellLink {...props} />
  }

  if (meta?.cellType === 'datetime') {
    return <DataTableCellDatetime {...props} />
  }

  if (meta?.cellType === 'money') {
    return <DataTableCellMoney {...props} />
  }

  if (meta?.cellType === 'badge') {
    return <DataTableCellBadge {...props} />
  }

  return (
    <div className='truncate' style={{ maxWidth: column.columnDef.maxSize }}>
      {getValue<string>()}
    </div>
  )
}

function DataTableCellLink<IData>({
  getValue,
  column,
  row,
}: CellContext<IData, unknown>) {
  const meta = column.columnDef.meta
  return (
    <Link href={meta?.cellLink?.(row.original) ?? '#'}>
      <Button
        className='pl-0'
        style={{ maxWidth: column.columnDef.maxSize }}
        variant={'link'}
      >
        <span className='truncate'>{getValue<string>()}</span>
      </Button>
    </Link>
  )
}

function DataTableCellMoney<IData>({ getValue }: CellContext<IData, unknown>) {
  const { formatCurrency } = useCurrency()
  const value = getValue<string>()

  return <div>{value && formatCurrency(value)}</div>
}

function DataTableCellDatetime<IData>({
  getValue,
}: CellContext<IData, unknown>) {
  const { formatDatetime } = useDatetime()
  const value = getValue<string>()

  return (
    <div className='w-32'>{value && formatDatetime(value, 'datetime')}</div>
  )
}

function DataTableCellBadge<IData>({
  getValue,
  column,
}: CellContext<IData, unknown>) {
  const t = useTranslations()

  const metaCellBadge = column.columnDef.meta?.cellBadge?.[getValue<string>()]

  return (
    <Badge variant={metaCellBadge?.variant ?? 'secondary'}>
      {metaCellBadge && t(metaCellBadge.label)}
    </Badge>
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
            <Link href={actionLink?.(row.original) ?? '#'} key={type}>
              <Button
                className='hover:bg-secondary'
                size={'icon'}
                variant={'ghost'}
              >
                {icon}
              </Button>
            </Link>
          )
        } else {
          return (
            <DataTableCellActionButton
              onClick={() => {
                setRowAction?.({ row, type: type })
              }}
              key={type}
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
      onClick={onClickThrottled}
      className='hover:bg-secondary'
      size={'icon'}
      variant={'ghost'}
    >
      {children}
    </Button>
  )
}
