'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { LuArchive, LuBox, LuFilePen } from 'react-icons/lu'

import { E_PRODUCT_STATUS } from '@prisma/client'

import { E_BULK_PRODUCT_TYPE } from '~/shared/dto/product/req'
import { IProductRes } from '~/shared/dto/product/res'

import { FilterSelect } from '~/app/_components/data-table/components/filter/filter-select'
import { DataTable } from '~/app/_components/data-table/data-table'
import {
  E_COMMON_BULK_ACTION_TYPE,
  E_COMMON_ROW_ACTION_TYPE,
} from '~/app/_components/data-table/data-table.interface'
import {
  IDataTableConfig,
  useDataTable,
} from '~/app/_components/data-table/hooks/use-data-table'
import { Button } from '~/app/_components/ui/button'

import { useBulkProducts } from '~/app/_apis/admin/product/useBulkProducts'
import {
  FILTER_DEFS,
  SORT_DEFAULTS,
  useGetProducts,
} from '~/app/_apis/admin/product/useGetProducts'
import { IOption } from '~/app/_interfaces/common.interface'

import { ConfirmDialog } from '../../_components/dialog/confirm-dialog'
import { PageHeader } from '../../_components/page-header'

export default function Page() {
  const { data, isFetching, refetch } = useGetProducts()
  const { mutate, mutateAsync } = useBulkProducts()

  const {
    columns,
    meta,
    rowAction,
    bulkAction,
    resetBulkAction,
    resetRowAction,
  } = useDataTable<IProductRes>(dataTableConfig)

  useEffect(() => {
    if (rowAction && !mustConfirmRowActions.includes(rowAction.type)) {
      handleBulkAction()
    }
  }, [rowAction])

  console.log('rowAction', rowAction)
  const handleBulkAction = async () => {
    if (!bulkAction) return

    console.log('bulkAction', bulkAction)
    const BULK_TYPE_MAP: Record<string, E_BULK_PRODUCT_TYPE> = {
      [E_BULK_ACTION_TYPE.ACTIVE]: E_BULK_PRODUCT_TYPE.ACTIVE,
      [E_BULK_ACTION_TYPE.ARCHIVE]: E_BULK_PRODUCT_TYPE.ARCHIVE,
      [E_BULK_ACTION_TYPE.DELETE]: E_BULK_PRODUCT_TYPE.DELETE,
    }
    mutate({
      ids: bulkAction.rowIds,
      type: BULK_TYPE_MAP[bulkAction.type],
    })
    // await mutateAsync({
    //   ids: bulkAction.rowIds,
    //   type: BULK_TYPE_MAP[bulkAction.type],
    // })
    console.log('ddd')
  }

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
        meta={meta}
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

      <ConfirmDialog
        open={bulkAction?.type === E_BULK_ACTION_TYPE.ARCHIVE}
        title={`Archive ${bulkAction?.rowIds.length} products?`}
        description=''
        actionTitle='Archive'
        actionVariant={'warning'}
        onOpenChange={resetBulkAction}
        onAction={handleBulkAction}
      />

      <ConfirmDialog
        open={bulkAction?.type === E_BULK_ACTION_TYPE.DELETE}
        title={`Delete ${bulkAction?.rowIds.length} products?`}
        onOpenChange={resetBulkAction}
        onAction={handleBulkAction}
      />

      <ConfirmDialog
        open={rowAction?.type === E_ROW_ACTION_TYPE.DELETE}
        title={`Delete this product?`}
        onOpenChange={resetRowAction}
        onAction={handleBulkAction}
      />

      <ConfirmDialog
        open={rowAction?.type === E_ROW_ACTION_TYPE.ARCHIVE}
        title={`Archive this product?`}
        description=''
        actionTitle='Archive'
        actionVariant={'warning'}
        onOpenChange={resetRowAction}
        onAction={handleBulkAction}
      />
    </>
  )
}

enum E_BULK_ACTION_TYPE {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVE = 'ARCHIVE',
  DELETE = E_COMMON_BULK_ACTION_TYPE.DELETE,
}
enum E_ROW_ACTION_TYPE {
  ACTIVE = 'ACTIVE',
  ARCHIVE = 'ARCHIVE',
  UPDATE = E_COMMON_ROW_ACTION_TYPE.UPDATE,
  DELETE = E_COMMON_ROW_ACTION_TYPE.DELETE,
}
const dataTableConfig: IDataTableConfig<IProductRes> = {
  columnDefs: [
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
      meta: {
        cellType: 'badge',
        cellBadge: {
          [E_PRODUCT_STATUS.DRAFT]: 'info',
          [E_PRODUCT_STATUS.ACTIVE]: 'success',
          [E_PRODUCT_STATUS.ARCHIVED]: 'secondary',
        },
      },
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
  sortDefaults: SORT_DEFAULTS,
  filterDefs: FILTER_DEFS,
  bulkActionDefs: [
    {
      label: 'Set as Active',
      icon: <LuBox className='text-success' />,
      type: E_BULK_ACTION_TYPE.ACTIVE,
    },
    {
      label: 'Set as Draft',
      icon: <LuFilePen className='text-info' />,
      type: E_BULK_ACTION_TYPE.DRAFT,
    },
    {
      label: 'Archive',
      icon: <LuArchive />,
      type: E_BULK_ACTION_TYPE.ARCHIVE,
    },
    { type: E_BULK_ACTION_TYPE.DELETE },
  ],
  rowActionDefs: [
    {
      icon: <LuBox className='text-success' />,
      type: E_ROW_ACTION_TYPE.ACTIVE,
    },
    {
      icon: <LuArchive />,
      type: E_ROW_ACTION_TYPE.ARCHIVE,
    },
    {
      type: E_ROW_ACTION_TYPE.UPDATE,
      actionLink: (row) => `/admin/products/${row.id}`,
    },
    { type: E_ROW_ACTION_TYPE.DELETE },
  ],
}

const mustConfirmRowActions: string[] = [
  E_ROW_ACTION_TYPE.DELETE,
  E_ROW_ACTION_TYPE.ARCHIVE,
]

const mustConfirmBulkActions = [
  E_BULK_ACTION_TYPE.DELETE,
  E_BULK_ACTION_TYPE.ARCHIVE,
]

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
