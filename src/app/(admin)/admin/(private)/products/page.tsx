'use client'

import Link from 'next/link'

import { E_PRODUCT_STATUS } from '@prisma/client'

import { FilterSelect } from '~/app/_components/data-table/components/filter/filter-select'
import { DataTable } from '~/app/_components/data-table/data-table'
import { useDataTableColumn } from '~/app/_components/data-table/hooks/use-data-table-column'
import { Button } from '~/app/_components/ui/button'

import {
  FILTER_DEFS,
  SORT_DEFAULTS,
  useGetProducts,
} from '~/app/_apis/admin/product/useGetProducts'
import { IOption } from '~/app/_interfaces/common'

import { PageHeader } from '../../_components/page-header'

export default function Page() {
  const { data, isFetching, refetch } = useGetProducts()

  const { columns, rowAction } = useDataTableColumn(
    [
      {
        accessorKey: 'id',
        meta: {
          headerTitle: 'ID',
        },
      },
      {
        accessorKey: 'name',
        enableSorting: true,
        meta: {
          cellType: 'link',
          cellLink: (row) => `/admin/products/${row.original.id}`,
        },
      },
      {
        accessorKey: 'description',
      },
      {
        accessorKey: 'price',
        enableSorting: true,
        meta: {
          cellType: 'money',
        },
      },
      {
        accessorKey: 'status',
        enableSorting: true,
      },
      {
        accessorKey: 'totalVariants',
        enableSorting: true,
      },
      {
        accessorKey: 'createdAt',
        enableSorting: true,
        meta: {
          cellType: 'datetime',
        },
      },
    ],
    {
      showSelectColumn: true,
      showActionColumn: true,
      editLink: (row) => `/admin/products/${row.id}`,
    },
  )
  return (
    <>
      <PageHeader title='Products'>
        <Link href='/admin/products/create'>
          <Button>Create</Button>
        </Link>
      </PageHeader>
      <DataTable
        data={data?.data ?? []}
        total={data?.total ?? 0}
        columns={columns}
        isFetching={isFetching}
        sortDefaults={SORT_DEFAULTS}
        filterDefs={FILTER_DEFS}
        getRowId={(row) => row.id}
        onRefetch={refetch}
        filterNode={
          <>
            <FilterSelect
              title='Status'
              queryField='status'
              options={STATUS_OPTIONS}
            />
            <FilterSelect
              title='Total Variants'
              queryField='totalVariants'
              options={TOTAL_VARIANTS_OPTIONS}
              isSingleSelect
            />
          </>
        }
      />
    </>
  )
}

const STATUS_OPTIONS: IOption<E_PRODUCT_STATUS>[] = [
  {
    label: 'Draft',
    value: E_PRODUCT_STATUS.DRAFT,
  },
  {
    label: 'Active',
    value: E_PRODUCT_STATUS.ACTIVE,
  },
  {
    label: 'Inactive',
    value: E_PRODUCT_STATUS.ARCHIVED,
  },
]
const TOTAL_VARIANTS_OPTIONS: IOption<number>[] = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
]
