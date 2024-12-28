'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { LuPen, LuTrash } from 'react-icons/lu'

import {
  ColumnDef,
  PaginationState,
  SortingState,
  Updater,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { IProductRes } from '~/shared/dto/product/res'

import { useQueryList } from '~/app/_hooks/query/use-query-list'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTablePagination } from './data-table-pagination'

export default function DataTable<IData extends IProductRes>({
  data,
  total,
  isLoading,
  sortDefaults,
}: {
  data: IData[] | undefined
  total: number | undefined
  isLoading: boolean
  sortDefaults?: string[][]
}) {
  // const colors = ['red', 'green', 'blue'] as const

  // const [color, setColor] = useQueryState(
  //   'color',
  //   parseAsStringLiteral(colors) // pass a readonly list of allowed values
  //     .withDefault('red'),
  // )

  const columns = useMemo(() => {
    const columns: ColumnDef<IData>[] = [
      {
        id: 'select',
        meta: {
          sizePercentage: 0,
        },
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllRowsSelected() ||
              (table.getIsSomeRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(!!checked)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
      },
      {
        accessorKey: 'id',
        meta: {
          sizePercentage: 16,
        },
        header: (ctx) => {
          console.log(ctx)
          return <DataTableColumnHeader {...ctx} />
        },
        cell: ({ row }) => (
          <div className='max-w-24 truncate'>{row.original.id}</div>
        ),
      },
      {
        accessorKey: 'name',
        meta: {
          sizePercentage: 16,
        },
        header: (ctx) => {
          console.log(ctx)
          return <DataTableColumnHeader {...ctx} />
        },
        cell: ({ row }) => (
          <div className='max-w-md truncate'>{row.original.name}</div>
        ),
      },
      {
        accessorKey: 'description',
        meta: {
          sizePercentage: 16,
        },
        cell: ({ row }) => (
          <div className='max-w-md truncate'>{row.original.description}</div>
        ),
      },
      {
        accessorKey: 'price',
        meta: {
          sizePercentage: 16,
        },
      },
      {
        accessorKey: 'status',
        meta: {
          sizePercentage: 16,
        },
      },
      {
        accessorKey: 'createdAt',
        meta: {
          sizePercentage: 16,
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
        id: 'action',
        meta: {
          sizePercentage: 0,
        },
        cell: ({ row }) => (
          <div className='flex'>
            <Link href={`/admin/products/${row.original.id}`}>
              <Button size={'icon'} variant={'ghost'}>
                <LuPen className='text-info' />
              </Button>
            </Link>
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={() => {
                // console.log(color)
                // setColor(colors[random(0, colors.length - 1, false)])
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

  // const [pageSize, setPageSize] = useQueryPageSize()
  // const [pageIndex, setPageIndex] = useQueryState(
  //   'page',
  //   parseAsInteger.withDefault(1),
  // )
  // const [sort, setSort] = useQueryState<string[][]>('sort', {
  //   defaultValue: [['createdAt', 'desc']],
  //   parse: (sortRaw) => {
  //     return []
  //   },
  //   serialize: (sort) => {
  //     return sort.map((s) => s.join(':')).join(',')
  //   },
  // })

  const [{ search, page, size, sort }, setQueryList] =
    useQueryList(sortDefaults)

  const table = useReactTable({
    data: data ?? [],
    rowCount: total ?? 0,
    columns,
    initialState: {
      // pagination: {
      //   pageIndex: 1,
      //   pageSize: 30,
      // },
      // sorting: [{ id: 'createdAt', desc: false }],
    },
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
      sorting: sort?.map((s) => ({ id: s[0], desc: s[1] === 'desc' })),
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange(updaterOrValue: Updater<PaginationState>) {
      const _pagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue({ pageIndex: page - 1, pageSize: size })
          : updaterOrValue

      setQueryList({
        page: _pagination.pageIndex + 1,
        size: _pagination.pageSize,
      })
    },
    onSortingChange(updaterOrValue: Updater<SortingState>) {
      const _sortingState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue([])
          : updaterOrValue

      setQueryList({
        sort: _sortingState.map((s) => [s.id, s.desc ? 'desc' : 'asc']),
      })
    },
  })

  return (
    <div className='space-y-2'>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: `${header.column.columnDef.meta?.sizePercentage ?? 50}%`,
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
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
                    <TableCell key={cell.id}>
                      <div className='flex h-10 items-center'>
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
                  className='h-24 text-center'
                >
                  {isLoading ? 'Loading...' : ' No results found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col'>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
