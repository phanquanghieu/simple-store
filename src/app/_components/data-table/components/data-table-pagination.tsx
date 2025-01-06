import { useTranslations } from 'next-intl'
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from 'react-icons/lu'

import { values } from 'lodash'

import { Button } from '../../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { useTable } from '../data-table.context'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50]

export function DataTablePagination({
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: {
  pageSizeOptions?: number[]
}) {
  const { table } = useTable()

  const countSelectedRow = values(table.getState().rowSelection).filter(
    Boolean,
  ).length

  const t = useTranslations()

  if (table.getRowCount() === 0) {
    return null
  }

  return (
    <div className='-mx-1 flex flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8'>
      <div className='flex-1 whitespace-nowrap text-sm text-muted-foreground'>
        {t('Admin.Common.Pagination.rowSelected', {
          count: countSelectedRow,
          total: table.getRowCount(),
        })}
      </div>
      <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        <div className='flex items-center space-x-2'>
          <p className='whitespace-nowrap text-sm text-muted-foreground'>
            {t('Admin.Common.Pagination.rowsPerPage')}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[4.5rem]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-center text-sm text-muted-foreground'>
          {t('Admin.Common.Pagination.pageOf', {
            page: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden size-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <LuChevronsLeft className='size-4' aria-hidden='true' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <LuChevronLeft className='size-4' aria-hidden='true' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <LuChevronRight className='size-4' aria-hidden='true' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <LuChevronsRight className='size-4' aria-hidden='true' />
          </Button>
        </div>
      </div>
    </div>
  )
}
