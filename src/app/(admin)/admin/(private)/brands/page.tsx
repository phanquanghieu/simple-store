'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'

import { E_BULK_BRAND_TYPE } from '~/shared/dto/brand/req'
import { IBrandRes } from '~/shared/dto/brand/res'

import { DataTable } from '~/app/_components/data-table/data-table'
import {
  BULK_ACTION_COMMON,
  ROW_ACTION_COMMON,
} from '~/app/_components/data-table/data-table.constant'
import {
  IDataTableConfig,
  useDataTable,
} from '~/app/_components/data-table/hooks/use-data-table'
import { Button } from '~/app/_components/ui/button'

import { useBulkBrands } from '~/app/_apis/admin/brand/useBulkBrands'
import { useDeleteBrand } from '~/app/_apis/admin/brand/useDeleteBrand'
import {
  FILTER_DEFS,
  SORT_DEFAULTS,
  useGetListBrands,
} from '~/app/_apis/admin/brand/useGetListBrands'

import { ConfirmDialog } from '../../_components/dialogs/confirm-dialog'
import { PageHeader } from '../../_components/page-header'

export default function Page() {
  const { data, isFetching, refetch } = useGetListBrands()
  const { mutate: mutateBulk, isPending: isBulkPending } = useBulkBrands()
  const { mutate: mutateDelete, isPending: isDeletePending } = useDeleteBrand()

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
  } = useDataTable<IBrandRes>(dataTableConfig)

  const handleBulkAction = async () => {
    if (!bulkAction) return

    mutateBulk(
      {
        ids: bulkAction.rowIds,
        type: bulkAction.type as E_BULK_BRAND_TYPE,
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
      mutateDelete(rowAction.row.id, {
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
      <PageHeader title={t('Admin.Brand.brands')}>
        <Link href='/admin/brands/create'>
          <Button size={'sm-icon'}>
            <LuPlus />
            {t('Common.create')}
          </Button>
        </Link>
      </PageHeader>
      <DataTable
        onRefetch={refetch}
        setRowSelection={setRowSelection}
        columns={columns}
        data={data?.data}
        getRowId={(row) => row.id}
        isFetching={isFetching}
        meta={meta}
        rowSelection={rowSelection}
        total={data?.total}
      />

      <ConfirmDialog
        onAction={handleBulkAction}
        onOpenChange={resetBulkAction}
        actionTitle={t('Common.delete')}
        actionVariant={'destructive'}
        isActionPending={isBulkPending}
        open={bulkAction?.type === E_BULK_BRAND_TYPE.DELETE}
        title={t('Admin.Brand.BulkAction.Confirm.DELETE', {
          count: bulkAction?.rowIds.length,
        })}
      />

      <ConfirmDialog
        onAction={handleRowAction}
        onOpenChange={resetRowAction}
        actionTitle={t('Common.delete')}
        actionVariant={'destructive'}
        isActionPending={isDeletePending}
        open={rowAction?.type === E_ROW_ACTION_TYPE.DELETE}
        title={t('Admin.Brand.RowAction.Confirm.DELETE')}
      />
    </>
  )
}

enum E_ROW_ACTION_TYPE {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
const dataTableConfig: IDataTableConfig<IBrandRes> = {
  columnDefs: [
    {
      accessorKey: 'name',
      enableSorting: true,
      meta: {
        headerTitle: 'Admin.Brand.name',
        cellType: 'link',
        cellLink: (row) => `/admin/brands/${row.id}`,
      },
    },
    {
      accessorKey: 'description',
      meta: {
        headerTitle: 'Admin.Brand.description',
      },
    },
    {
      accessorKey: 'updatedAt',
      enableSorting: true,
      meta: {
        headerTitle: 'Common.updatedAt',
        cellType: 'datetime',
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
      ...BULK_ACTION_COMMON.DELETE,
      type: E_BULK_BRAND_TYPE.DELETE,
    },
  ],
  rowActionDefs: [
    {
      ...ROW_ACTION_COMMON.UPDATE,
      type: E_ROW_ACTION_TYPE.UPDATE,
      actionLink: (row) => `/admin/brands/${row.id}`,
    },

    { ...ROW_ACTION_COMMON.DELETE, type: E_ROW_ACTION_TYPE.DELETE },
  ],
}
