import Link from 'next/link'
import { useMemo, useState } from 'react'
import { LuPen, LuTrash } from 'react-icons/lu'

import { ColumnDef } from '@tanstack/react-table'

import { E_COLUMN_ID } from '~/app/_interfaces/data-table'

import { Button } from '../../ui/button'

export interface IColumnDefConfig<IData> {
  showSelectColumn?: boolean
  showActionColumn?: boolean
  hideEdit?: boolean
  hideDelete?: boolean
  editLink?: (row: IData) => string
}

export function useDataTableColumn<IData>(
  _columns: ColumnDef<IData>[],
  columnDefConfig?: IColumnDefConfig<IData>,
) {
  const [rowAction, setRowAction] = useState()
  const columns = useMemo(() => {
    if (!columnDefConfig) {
      return _columns
    }

    if (columnDefConfig.showSelectColumn) {
      _columns.unshift({
        id: E_COLUMN_ID.SELECT,
        size: 40,
      })
    }

    if (columnDefConfig.showActionColumn) {
      const actionColumn: ColumnDef<IData> = {
        id: E_COLUMN_ID.ACTION,
        size: 80,
        meta: {
          headerTitle: null,
        },
        cell: ({ row }) => (
          <div className='-mx-1 flex'>
            {!columnDefConfig.hideEdit && (
              <Link href={columnDefConfig.editLink!(row.original)}>
                <Button size={'icon'} variant={'ghost'}>
                  <LuPen className='text-info' />
                </Button>
              </Link>
            )}
            {!columnDefConfig.hideDelete && (
              <Button
                size={'icon'}
                variant={'ghost'}
                onClick={() => {
                  setRowAction({ row, type: 'delete' })
                }}
              >
                <LuTrash className='text-destructive' />
              </Button>
            )}
          </div>
        ),
      }

      _columns.push(actionColumn)
    }

    return _columns
  }, [_columns, columnDefConfig, setRowAction])

  return { columns, rowAction, setRowAction }
}
