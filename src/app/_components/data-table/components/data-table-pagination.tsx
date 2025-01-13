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
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
            value={`${table.getState().pagination.pageSize}`}
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
            onClick={() => table.setPageIndex(0)}
            className='hidden size-8 p-0 lg:flex'
            disabled={!table.getCanPreviousPage()}
            variant='outline'
          >
            <LuChevronsLeft aria-hidden='true' className='size-4' />
          </Button>
          <Button
            onClick={() => table.previousPage()}
            className='size-8'
            disabled={!table.getCanPreviousPage()}
            size='icon'
            variant='outline'
          >
            <LuChevronLeft aria-hidden='true' className='size-4' />
          </Button>
          <Button
            onClick={() => table.nextPage()}
            className='size-8'
            disabled={!table.getCanNextPage()}
            size='icon'
            variant='outline'
          >
            <LuChevronRight aria-hidden='true' className='size-4' />
          </Button>
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            className='hidden size-8 lg:flex'
            disabled={!table.getCanNextPage()}
            size='icon'
            variant='outline'
          >
            <LuChevronsRight aria-hidden='true' className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
