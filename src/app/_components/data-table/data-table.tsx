'use client'

import { useMemo } from 'react'

import {
  ColumnDef,
  PaginationState,
  Updater,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { parseAsInteger, useQueryState } from 'nuqs'

import { IProductRes } from '~/shared/dto/product/res'

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
import { DataTablePagination } from './data-table-pagination'

export default function DataTable({}: {
  // columns
}) {
  const columns = useMemo(() => {
    const columns: ColumnDef<IProductRes>[] = [
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
          sizePercentage: 10,
        },
        cell: ({ row }) => <div className='lowercase'>{row.original.id}</div>,
      },
      {
        accessorKey: 'name',
        meta: {
          sizePercentage: 10,
        },
        cell: ({ row }) => <Button size={'sm'}> {row.original.name}</Button>,
      },
      {
        accessorKey: 'description',
        meta: {
          sizePercentage: 10,
        },
        cell: ({ row }) => (
          <div className='max-w-md truncate'>{row.original.description}</div>
        ),
      },
      {
        accessorKey: 'price',
        meta: {
          sizePercentage: 10,
        },
      },
      {
        accessorKey: 'status',
        meta: {
          sizePercentage: 10,
        },
      },
    ]
    return columns
  }, [])

  const [pageSize, setPageSize] = useQueryState(
    'size',
    parseAsInteger.withDefault(10),
  )
  const [pageIndex, setPageIndex] = useQueryState(
    'page',
    parseAsInteger.withDefault(1),
  )

  const table = useReactTable({
    data: products,
    columns,
    initialState: {
      pagination: {
        pageIndex: 1,
        pageSize: 10,
      },
    },
    state: {
      pagination: {
        pageIndex: pageIndex - 1,
        pageSize,
      },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange(updaterOrValue: Updater<PaginationState>) {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue({
          pageIndex: pageIndex - 1,
          pageSize: pageSize,
        })
        setPageIndex(newPagination.pageIndex + 1)
        setPageSize(newPagination.pageSize)
      } else {
        setPageIndex(updaterOrValue.pageIndex + 1)
        setPageSize(updaterOrValue.pageSize)
      }
    },
  })

  console.log(table)
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
                  No results
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

const productsCore: IProductRes[] = [
  // {
  //   id: '1',
  //   categoryId: '1',
  //   brandId: '1',
  //   variantAttribute1Id: '1',
  //   variantAttribute2Id: '2',
  //   variantAttribute3Id: '3',
  //   name: 'Product 1',
  //   slug: 'product-1',
  //   description: 'Description for product 1',
  //   price: '100',
  //   compareAtPrice: '120',
  //   totalVariants: 3,
  //   status: 'ACTIVE',
  //   updatedAt: new Date().toISOString(),
  //   createdAt: new Date().toISOString(),
  // },
  {
    id: '2',
    categoryId: '2',
    brandId: '2',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 2',
    slug: 'product-2',
    description: 'Description for product 2',
    price: '200',
    compareAtPrice: '220',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    categoryId: '3',
    brandId: '3',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 3',
    slug: 'product-3',
    description: 'Description for product 3',
    price: '300',
    compareAtPrice: '320',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    categoryId: '4',
    brandId: '4',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 4',
    slug: 'product-4',
    description:
      'Description for product 4 Description for product 4 Description for product 4 Description for product 4 Description for product 4',
    price: '400',
    compareAtPrice: '420',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    categoryId: '5',
    brandId: '5',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 5',
    slug: 'product-5',
    description: 'Description for product 5',
    price: '500',
    compareAtPrice: '520',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    categoryId: '6',
    brandId: '6',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 6',
    slug: 'product-6',
    description: 'Description for product 6',
    price: '600',
    compareAtPrice: '620',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    categoryId: '7',
    brandId: '7',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 7',
    slug: 'product-7',
    description: 'Description for product 7',
    price: '700',
    compareAtPrice: '720',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    categoryId: '8',
    brandId: '8',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 8',
    slug: 'product-8',
    description: 'Description for product 8',
    price: '800',
    compareAtPrice: '820',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    categoryId: '9',
    brandId: '9',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 9',
    slug: 'product-9',
    description: 'Description for product 9',
    price: '900',
    compareAtPrice: '920',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    categoryId: '10',
    brandId: '10',
    variantAttribute1Id: '1',
    variantAttribute2Id: '2',
    variantAttribute3Id: '3',
    name: 'Product 10',
    slug: 'product-10',
    description: 'Description for product 10',
    price: '1000',
    compareAtPrice: '1020',
    totalVariants: 3,
    status: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
]

const products = [
  ...productsCore,
  ...productsCore,
  ...productsCore,
  ...productsCore,
]
