'use client'

import Link from 'next/link'
import { Suspense } from 'react'

import { E_PRODUCT_STATUS } from '@prisma/client'

import { FilterSelect } from '~/app/_components/data-table/components/filter/filter-select'
import DataTable from '~/app/_components/data-table/data-table'
import { Button } from '~/app/_components/ui/button'

import {
  FILTER_DEFS,
  SORT_DEFAULTS,
  useGetProducts,
} from '~/app/_apis/admin/product/useGetProducts'

import { PageHeader } from '../../_components/page-header'

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

export default function Page() {
  const { data, isFetching, refetch } = useGetProducts()
  return (
    <>
      <PageHeader title='Products'>
        <Link href='/admin/products/create'>
          <Button>Create</Button>
        </Link>
      </PageHeader>
      <Suspense>
        <DataTable
          data={data?.data ?? []}
          total={data?.total ?? 0}
          isFetching={isFetching}
          sortDefaults={SORT_DEFAULTS}
          filterDefs={FILTER_DEFS}
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
          onRefetch={refetch}
        />
      </Suspense>
    </>
  )
}
