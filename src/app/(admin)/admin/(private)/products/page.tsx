'use client'

import Link from 'next/link'
import { Suspense } from 'react'

import DataTable from '~/app/_components/data-table/data-table'
import { Button } from '~/app/_components/ui/button'

import { useGetProducts } from '~/app/_apis/admin/product/useGetProducts'

import { PageHeader } from '../../_components/page-header'

const SORT_DEFAULTS = [['name', 'asc']]

export default function Page() {
  const { data, isLoading } = useGetProducts({ sort: SORT_DEFAULTS })
  return (
    <>
      <PageHeader title='Products'>
        <Link href='/admin/products/create'>
          <Button>Create</Button>
        </Link>
      </PageHeader>
      <Suspense>
        <DataTable
          data={data?.data}
          total={data?.total}
          isLoading={isLoading}
          sortDefaults={SORT_DEFAULTS}
        />
      </Suspense>
    </>
  )
}
