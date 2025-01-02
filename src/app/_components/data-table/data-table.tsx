'use client'

import { ReactNode, useState } from 'react'
import { LuRotateCw } from 'react-icons/lu'

import {
  ColumnDef,
  GlobalFilterState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { isEmpty } from 'lodash'

import { useQueryFilter } from '~/app/_hooks/query/use-query-filter'
import { useQueryList } from '~/app/_hooks/query/use-query-list'
import { useDebouncedCallback } from '~/app/_hooks/use-debounced-callback'

import { cn } from '~/app/_libs/utils'

import { E_COLUMN_ID, IFilterDef } from '../../_interfaces/data-table'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { DataTableCell } from './components/data-table-cell'
import { DataTableFilter } from './components/data-table-filter'
import { DataTableHeader } from './components/data-table-header'
import { DataTablePagination } from './components/data-table-pagination'
import { DataTableContext } from './data-table.context'

const DEBOUNCE_DELAY = 500

export function DataTable<IData extends object>({
  data,
  total,
  columns,
  isFetching,
  sortDefaults,
  filterNode,
  filterDefs,
  getRowId,
  onRefetch,
}: {
  data: IData[]
  total: number
  columns: ColumnDef<IData>[]
  isFetching: boolean
  sortDefaults?: string[][]
  filterNode?: ReactNode
  filterDefs?: IFilterDef[]
  getRowId: (row: IData) => string
  onRefetch: () => void
}) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const [{ page, size, sort }, setQueryList] = useQueryList(sortDefaults)

  const [queryFilter, setQueryFilter] = useQueryFilter(filterDefs)

  const setQueryFilterDebounced = useDebouncedCallback(
    setQueryFilter,
    DEBOUNCE_DELAY,
  )

  const [globalFilter, setGlobalFilter] =
    useState<GlobalFilterState>(queryFilter)

  const table = useReactTable({
    data,
    rowCount: total,
    columns,
    initialState: {
      columnPinning: {
        left: [E_COLUMN_ID.SELECT],
        right: [E_COLUMN_ID.ACTION],
      },
    },
    state: {
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: util.toPageIndex(page),
        pageSize: size,
      },
      sorting: util.toSortingState(sort),
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    defaultColumn: {
      size: undefined,
      maxSize: 360,
      enableSorting: false,
      header: DataTableHeader,
      cell: DataTableCell,
    },
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange(updaterOrValue: Updater<GlobalFilterState>) {
      const _globalFilter =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(globalFilter)
          : { ...globalFilter, ...updaterOrValue }

      setGlobalFilter(_globalFilter)
      setRowSelection({})
      setQueryList({ page: 1 })

      setQueryFilterDebounced(_globalFilter)
    },
    onPaginationChange(updaterOrValue: Updater<PaginationState>) {
      const _pagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue({
              pageIndex: util.toPageIndex(page),
              pageSize: size,
            })
          : updaterOrValue

      setQueryList({
        page: util.fromPageIndex(_pagination.pageIndex),
        size: _pagination.pageSize,
      })
    },
    onSortingChange(updaterOrValue: Updater<SortingState>) {
      const _sortingState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(util.toSortingState(sort))
          : updaterOrValue

      setRowSelection({})
      setQueryList({
        page: 1,
        sort: util.fromSortingState(_sortingState),
      })
    },
  })

  return (
    <DataTableContext.Provider value={{ table }}>
      <div className='space-y-2'>
        <div className='-mx-1 flex items-center justify-between p-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              size={'icon'}
              variant={'outline'}
              className='size-8'
              onClick={onRefetch}
              disabled={isFetching}
            >
              {isFetching ? <Spinner className='' /> : <LuRotateCw />}
            </Button>
            <DataTableFilter>{filterNode}</DataTableFilter>
          </div>
          <div className='flex items-center gap-2'></div>
        </div>
        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn({
                        'sticky left-0 bg-background':
                          header.column.getIsPinned() === 'left',
                        'sticky right-0 bg-background':
                          header.column.getIsPinned() === 'right',
                      })}
                      style={{
                        width: `${header.column.columnDef.meta?.sizePercent ?? (header.column.columnDef.size ? 0 : 20)}%`,
                      }}
                    >
                      <div
                        className='flex items-center px-2'
                        style={{ width: header.column.columnDef.size }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn({
                          'sticky left-0 bg-background':
                            cell.column.getIsPinned() === 'left',
                          'sticky right-0 bg-background':
                            cell.column.getIsPinned() === 'right',
                          'bg-muted': row.getIsSelected(),
                        })}
                      >
                        <div
                          className='flex h-10 items-center truncate px-2'
                          style={{ width: cell.column.columnDef.size }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className='h-96 text-center text-lg text-muted-foreground'
                  >
                    {isFetching ? 'Loading...' : 'No results found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination />
      </div>
    </DataTableContext.Provider>
  )
}

const util = {
  toPageIndex(page: number): number {
    return page - 1
  },
  fromPageIndex(pageIndex: number): number {
    return pageIndex + 1
  },
  toSortingState(sort: string[][] | null | undefined): SortingState {
    return sort?.map((s) => ({ id: s[0], desc: s[1] === 'desc' })) ?? []
  },
  fromSortingState(sortingState: SortingState): string[][] | null {
    return isEmpty(sortingState)
      ? null
      : sortingState.map((s) => [s.id, s.desc ? 'desc' : 'asc'])
  },
}
