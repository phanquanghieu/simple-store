'use client'

import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { LuPen, LuRotateCw, LuTrash } from 'react-icons/lu'

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

import { IProductRes } from '~/shared/dto/product/res'

import { useQueryFilter } from '~/app/_hooks/query/use-query-filter'
import { useQueryList } from '~/app/_hooks/query/use-query-list'
import { useDebouncedCallback } from '~/app/_hooks/use-debounced-callback'

import { cn } from '~/app/_libs/utils'

import { E_COLUMN_ID, IFilterDef } from '../../_interfaces/data-table'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Spinner } from '../ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { DataTableColumnHeader } from './components/data-table-column-header'
import { DataTableFilter } from './components/data-table-filter'
import { DataTablePagination } from './components/data-table-pagination'
import { DataTableContext } from './data-table.context'

const DEBOUNCE_DELAY = 500

export default function DataTable<IData extends IProductRes>({
  data,
  total,
  isFetching,
  sortDefaults,
  filterNode,
  filterDefs,
  onRefetch,
}: {
  data: IData[]
  total: number
  isFetching: boolean
  sortDefaults?: string[][]
  filterNode?: ReactNode
  filterDefs?: IFilterDef[]
  columnDefs?: ColumnDef<IData>[]
  onRefetch: () => void
}) {
  const columns = useMemo(() => {
    const columns: ColumnDef<IData>[] = [
      {
        id: E_COLUMN_ID.SELECT,
        size: 40,
        header: DataTableColumnHeader,
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            className='mx-1'
          />
        ),
      },
      {
        accessorKey: 'id',
        size: 50,
        meta: {
          headerTitle: 'ID',
          // sizePercent: 16,
        },
        header: DataTableColumnHeader,
        // cell: ({ row }) => (
        //   <div className='max-w-24 truncate'>{row.original.id}</div>
        // ),
      },
      {
        accessorKey: 'name',
        meta: {
          sizePercent: 16,
        },
        header: DataTableColumnHeader,
        cell: ({ row }) => (
          <div className='max-w-md truncate'>{row.original.name}</div>
        ),
      },
      {
        accessorKey: 'description',
        meta: {
          sizePercent: 16,
        },
        cell: ({ row }) => (
          <div className='max-w-md truncate'>{row.original.description}</div>
        ),
      },
      {
        accessorKey: 'price',
        meta: {
          sizePercent: 16,
        },
      },
      {
        accessorKey: 'status',
        meta: {
          sizePercent: 16,
        },
        header: DataTableColumnHeader,
      },
      {
        accessorKey: 'totalVariants',
        meta: {
          sizePercent: 10,
        },
        header: DataTableColumnHeader,
      },
      {
        accessorKey: 'createdAt',
        meta: {
          sizePercent: 16,
        },
        cell: ({ row }) => (
          <>
            {Intl.DateTimeFormat('vi', {
              dateStyle: 'short',
              timeStyle: 'short',
            }).format(new Date(row.original.createdAt))}
          </>
        ),
      },
      {
        id: E_COLUMN_ID.ACTION,
        meta: {
          sizePercent: 0,
        },
        cell: ({ row }) => (
          <div className='-mx-1 flex'>
            <Link href={`/admin/products/${row.original.id}`}>
              <Button size={'icon'} variant={'ghost'}>
                <LuPen className='text-info' />
              </Button>
            </Link>
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={() => {
                console.log('delete', row, table.getState().rowSelection)
              }}
            >
              <LuTrash className='text-destructive' />
            </Button>
          </div>
        ),
      },
    ]
    return columns
  }, [])

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
    },
    getRowId: (row) => row.id,
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

      setRowSelection({})
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
          <div className='flex items-center gap-2'>
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
                        width: `${header.column.columnDef.meta?.sizePercent ?? (header.column.columnDef.size ? 0 : 50)}%`,
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
