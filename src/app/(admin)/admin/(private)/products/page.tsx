'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LuArchive, LuBox, LuFilePen } from 'react-icons/lu'

import { E_PRODUCT_STATUS } from '@prisma/client'

import { E_BULK_PRODUCT_TYPE } from '~/shared/dto/product/req'
import { IProductRes } from '~/shared/dto/product/res'

import {
  BULK_ACTION_COMMON,
  DataTable,
  FSelect,
  FSelectBrand,
  IDataTableConfig,
  ROW_ACTION_COMMON,
  useDataTable,
} from '~/app/_components/data-table'
import { Button } from '~/app/_components/ui/button'

import { useBulkProducts } from '~/app/_apis/admin/product/useBulkProducts'
import { useDeleteProduct } from '~/app/_apis/admin/product/useDeleteProduct'
import {
  FILTER_DEFS,
  SORT_DEFAULTS,
  useGetListProducts,
} from '~/app/_apis/admin/product/useGetListProducts'

import { ConfirmDialog } from '../../_components/dialogs/confirm-dialog'
import { PageHeader } from '../../_components/page-header'
import { STATUS_OPTIONS } from './_common'

export default function Page() {
  const { data, isFetching, refetch } = useGetListProducts()
  const { mutate: mutateBulkProducts, isPending: isBulkProductsPending } =
    useBulkProducts()
  const { mutate: mutateDeleteProduct, isPending: isDeleteProductPending } =
    useDeleteProduct()

  const {
    columns,
    meta,
    rowAction,
    resetRowAction,
    bulkAction,
    resetBulkAction,
    rowSelection,
    setRowSelection,
    resetRowSelection,
  } = useDataTable<IProductRes>(dataTableConfig)

  const handleBulkAction = async () => {
    if (!bulkAction) return

    mutateBulkProducts(
      {
        ids: bulkAction.rowIds,
        type: bulkAction.type as E_BULK_PRODUCT_TYPE,
      },
      {
        onSettled: () => {
          resetBulkAction()
          resetRowSelection()
        },
      },
    )
  }

  const handleRowAction = async () => {
    if (!rowAction) return

    if (rowAction.type === E_ROW_ACTION_TYPE.DELETE) {
      mutateDeleteProduct(rowAction.row.id, {
        onSettled: () => {
          resetRowAction()
          resetRowSelection()
        },
      })
    }
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader title={t('Admin.Product.products')}>
        <Link href='/admin/products/create'>
          <Button>{t('Common.create')}</Button>
        </Link>
      </PageHeader>
      <DataTable
        onRefetch={refetch}
        setRowSelection={setRowSelection}
        columns={columns}
        data={data?.data}
        filterNode={
          <>
            <FSelect
              isMultiSelect
              isOptionLabelMessageKey
              options={STATUS_OPTIONS}
              placeholder={'Admin.Product.status'}
              queryField='status'
            />
            <FSelectBrand isMultiSelect isSearchable queryField='brandIds' />
          </>
        }
        getRowId={(row) => row.id}
        isFetching={isFetching}
        meta={meta}
        rowSelection={rowSelection}
        total={data?.total}
      />

      <ConfirmDialog
        onAction={handleBulkAction}
        onOpenChange={resetBulkAction}
        isActionPending={isBulkProductsPending}
        open={bulkAction?.type === E_BULK_PRODUCT_TYPE.ACTIVATE}
        title={t('Admin.Product.BulkAction.Confirm.ACTIVATE', {
          count: bulkAction?.rowIds.length,
        })}
      />

      <ConfirmDialog
        onAction={handleBulkAction}
        onOpenChange={resetBulkAction}
        isActionPending={isBulkProductsPending}
        open={bulkAction?.type === E_BULK_PRODUCT_TYPE.DRAFT}
        title={t('Admin.Product.BulkAction.Confirm.DRAFT', {
          count: bulkAction?.rowIds.length,
        })}
      />

      <ConfirmDialog
        onAction={handleBulkAction}
        onOpenChange={resetBulkAction}
        isActionPending={isBulkProductsPending}
        open={bulkAction?.type === E_BULK_PRODUCT_TYPE.ARCHIVE}
        title={t('Admin.Product.BulkAction.Confirm.ARCHIVE', {
          count: bulkAction?.rowIds.length,
        })}
      />

      <ConfirmDialog
        onAction={handleBulkAction}
        onOpenChange={resetBulkAction}
        actionTitle={t('Common.delete')}
        actionVariant={'destructive'}
        isActionPending={isBulkProductsPending}
        open={bulkAction?.type === E_BULK_PRODUCT_TYPE.DELETE}
        title={t('Admin.Product.BulkAction.Confirm.DELETE', {
          count: bulkAction?.rowIds.length,
        })}
      />

      <ConfirmDialog
        onAction={handleRowAction}
        onOpenChange={resetRowAction}
        actionTitle={t('Common.delete')}
        actionVariant={'destructive'}
        isActionPending={isDeleteProductPending}
        open={rowAction?.type === E_ROW_ACTION_TYPE.DELETE}
        title={t('Admin.Product.RowAction.Confirm.DELETE')}
      />
    </>
  )
}

enum E_ROW_ACTION_TYPE {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
const dataTableConfig: IDataTableConfig<IProductRes> = {
  columnDefs: [
    {
      accessorKey: 'name',
      enableSorting: true,
      meta: {
        headerTitle: 'Admin.Product.name',
        cellType: 'link',
        cellLink: (row) => `/admin/products/${row.id}`,
      },
    },
    {
      accessorKey: 'description',
      meta: {
        headerTitle: 'Admin.Product.description',
      },
    },
    {
      accessorKey: 'price',
      enableSorting: true,
      meta: {
        headerTitle: 'Admin.Product.price',
        cellType: 'money',
      },
    },
    {
      accessorKey: 'status',
      enableSorting: true,
      meta: {
        headerTitle: 'Admin.Product.status',
        cellType: 'badge',
        cellBadge: {
          [E_PRODUCT_STATUS.DRAFT]: {
            variant: 'info',
            label: 'Admin.Product.Status.DRAFT',
          },
          [E_PRODUCT_STATUS.ACTIVE]: {
            variant: 'success',
            label: 'Admin.Product.Status.ACTIVE',
          },
          [E_PRODUCT_STATUS.ARCHIVED]: {
            variant: 'secondary',
            label: 'Admin.Product.Status.ARCHIVED',
          },
        },
      },
    },
    {
      accessorKey: 'totalVariants',
      enableSorting: true,
      meta: {
        headerTitle: 'Admin.Product.totalVariants',
      },
    },
    {
      accessorKey: 'createdAt',
      enableSorting: true,
      meta: {
        headerTitle: 'Common.createdAt',
        cellType: 'datetime',
      },
    },
  ],
  sortDefaults: SORT_DEFAULTS,
  filterDefs: FILTER_DEFS,
  bulkActionDefs: [
    {
      label: 'Admin.Product.BulkAction.Label.ACTIVATE',
      icon: <LuBox className='text-success' />,
      type: E_BULK_PRODUCT_TYPE.ACTIVATE,
    },
    {
      label: 'Admin.Product.BulkAction.Label.DRAFT',
      icon: <LuFilePen className='text-info' />,
      type: E_BULK_PRODUCT_TYPE.DRAFT,
    },
    {
      label: 'Admin.Product.BulkAction.Label.ARCHIVE',
      icon: <LuArchive />,
      type: E_BULK_PRODUCT_TYPE.ARCHIVE,
    },
    {
      ...BULK_ACTION_COMMON.DELETE,
      type: E_BULK_PRODUCT_TYPE.DELETE,
    },
  ],
  rowActionDefs: [
    {
      ...ROW_ACTION_COMMON.UPDATE,
      type: E_ROW_ACTION_TYPE.UPDATE,
      actionLink: (row) => `/admin/products/${row.id}`,
    },

    { ...ROW_ACTION_COMMON.DELETE, type: E_ROW_ACTION_TYPE.DELETE },
  ],
}
