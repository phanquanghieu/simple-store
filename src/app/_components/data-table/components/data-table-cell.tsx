'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

import { CellContext } from '@tanstack/react-table'

import { E_COLUMN_ID } from '~/app/_components/data-table/data-table.interface'

import { useThrottledCallback } from '~/app/_hooks/common/use-throttled-callback'
import { useCurrency } from '~/app/_hooks/use-currency'

import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Checkbox } from '../../ui/checkbox'

export function DataTableCell<IData>(props: CellContext<IData, unknown>) {
  const { column, getValue, row } = props

  const t = useTranslations()

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
    return (
      <Link href={meta?.cellLink?.(row.original) ?? '#'}>
        <Button className='pl-0' variant={'link'}>
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
    return <DataTableCellMoney {...props} />
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

function DataTableCellMoney<IData>({ getValue }: CellContext<IData, unknown>) {
  const { formatCurrency } = useCurrency()
  const value = getValue<string>()

  return <div>{value && formatCurrency(value)}</div>
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
