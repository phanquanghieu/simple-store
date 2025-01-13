'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { E_ATTRIBUTE_TYPE } from '@prisma/client'

import { E_BULK_ATTRIBUTE_TYPE } from '~/shared/dto/attribute/req'
import { IAttributeRes } from '~/shared/dto/attribute/res'
import { E_BULK_PRODUCT_TYPE } from '~/shared/dto/product/req'

import { FilterSelect } from '~/app/_components/data-table/components/filter/filter-select'
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

import { useBulkAttributes } from '~/app/_apis/admin/attribute/useBulkAttributes'
import { useDeleteAttribute } from '~/app/_apis/admin/attribute/useDeleteAttribute'
import {
  FILTER_DEFS,
  SORT_DEFAULTS,
  useGetAttributes,
} from '~/app/_apis/admin/attribute/useGetAttributes'

import { ConfirmDialog } from '../../_components/dialogs/confirm-dialog'
import { PageHeader } from '../../_components/page-header'
import { TYPE_OPTIONS } from './_common'

export default function Page() {
  const { data, isFetching, refetch } = useGetAttributes()
  const { mutate: mutateBulk, isPending: isBulkPending } = useBulkAttributes()
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteAttribute()

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
  } = useDataTable<IAttributeRes>(dataTableConfig)

  const handleBulkAction = async () => {
    if (!bulkAction) return

    mutateBulk(
      {
        ids: bulkAction.rowIds,
        type: bulkAction.type as E_BULK_ATTRIBUTE_TYPE,
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
      <PageHeader title={t('Admin.Attribute.attributes')}>
        <Link href='/admin/attributes/create'>
          <Button>{t('Common.create')}</Button>
        </Link>
      </PageHeader>
      <DataTable
        onRefetch={refetch}
        setRowSelection={setRowSelection}
        columns={columns}
        data={data?.data ?? []}
        filterNode={
          <>
            <FilterSelect
              isOptionLabelMessageKey
              options={TYPE_OPTIONS}
              queryField='type'
              title={'Admin.Attribute.type'}
            />
          </>
        }
        getRowId={(row) => row.id}
        isFetching={isFetching}
        meta={meta}
        rowSelection={rowSelection}
        total={data?.total ?? 0}
      />

      <ConfirmDialog
        onAction={handleBulkAction}
        onOpenChange={resetBulkAction}
        actionTitle={t('Common.delete')}
        actionVariant={'destructive'}
        isActionPending={isBulkPending}
        open={bulkAction?.type === E_BULK_ATTRIBUTE_TYPE.DELETE}
        title={t('Admin.Attribute.BulkAction.Confirm.DELETE', {
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
        title={t('Admin.Attribute.RowAction.Confirm.DELETE')}
      />
    </>
  )
}

enum E_ROW_ACTION_TYPE {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
const dataTableConfig: IDataTableConfig<IAttributeRes> = {
  columnDefs: [
    {
      accessorKey: 'name',
      enableSorting: true,
      meta: {
        headerTitle: 'Admin.Attribute.name',
        cellType: 'link',
        cellLink: (row) => `/admin/attributes/${row.id}`,
      },
    },
    {
      accessorKey: 'key',
      meta: {
        headerTitle: 'Admin.Attribute.key',
      },
    },
    {
      accessorKey: 'description',
      meta: {
        headerTitle: 'Admin.Attribute.description',
      },
    },
    {
      accessorKey: 'type',
      enableSorting: true,
      meta: {
        headerTitle: 'Admin.Attribute.type',
        cellType: 'badge',
        cellBadge: {
          [E_ATTRIBUTE_TYPE.TEXT]: {
            variant: 'secondary',
            label: 'Admin.Attribute.Type.TEXT',
          },
          [E_ATTRIBUTE_TYPE.COLOR]: {
            variant: 'secondary',
            label: 'Admin.Attribute.Type.COLOR',
          },
          [E_ATTRIBUTE_TYPE.BOOLEAN]: {
            variant: 'secondary',
            label: 'Admin.Attribute.Type.BOOLEAN',
          },
        },
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
      type: E_BULK_PRODUCT_TYPE.DELETE,
    },
  ],
  rowActionDefs: [
    {
      ...ROW_ACTION_COMMON.UPDATE,
      type: E_ROW_ACTION_TYPE.UPDATE,
      actionLink: (row) => `/admin/attributes/${row.id}`,
    },

    { ...ROW_ACTION_COMMON.DELETE, type: E_ROW_ACTION_TYPE.DELETE },
  ],
}
