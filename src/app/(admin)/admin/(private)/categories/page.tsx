'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'

import { E_BULK_CATEGORY_TYPE } from '~/shared/dto/category/req'
import { ICategoryRes } from '~/shared/dto/category/res'

import {
  BULK_ACTION_COMMON,
  DataTable,
  FSelectCategory,
  IDataTableConfig,
  ROW_ACTION_COMMON,
  useDataTable,
} from '~/app/_components/data-table'
import { Button } from '~/app/_components/ui/button'

import { useBulkCategories } from '~/app/_apis/admin/category/useBulkCategories'
import { useDeleteCategory } from '~/app/_apis/admin/category/useDeleteCategory'
import {
  FILTER_DEFS,
  SORT_DEFAULTS,
  useGetListCategories,
} from '~/app/_apis/admin/category/useGetListCategories'

import { ConfirmDialog } from '../../_components/dialogs/confirm-dialog'
import { PageHeader } from '../../_components/page-header'

export default function Page() {
  const { data, isFetching, refetch } = useGetListCategories()
  const { mutate: mutateBulk, isPending: isBulkPending } = useBulkCategories()
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteCategory()

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
  } = useDataTable<ICategoryRes>(dataTableConfig)

  const handleBulkAction = async () => {
    if (!bulkAction) return

    mutateBulk(
      {
        ids: bulkAction.rowIds,
        type: bulkAction.type as E_BULK_CATEGORY_TYPE,
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
      <PageHeader title={t('Admin.Category.categories')}>
        <Link href='/admin/categories/create'>
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
        filterNode={
          <FSelectCategory
            placeholder={'Admin.Category.parent'}
            queryField='parentIds'
          />
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
        actionTitle={t('Common.delete')}
        actionVariant={'destructive'}
        isActionPending={isBulkPending}
        open={bulkAction?.type === E_BULK_CATEGORY_TYPE.DELETE}
        title={t('Admin.Category.BulkAction.Confirm.DELETE', {
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
        title={t('Admin.Category.RowAction.Confirm.DELETE')}
      />
    </>
  )
}

enum E_ROW_ACTION_TYPE {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
const dataTableConfig: IDataTableConfig<ICategoryRes> = {
  columnDefs: [
    {
      accessorKey: 'name',
      enableSorting: true,
      meta: {
        headerTitle: 'Admin.Category.name',
        cellType: 'link',
        cellLink: (row) => `/admin/categories/${row.id}`,
      },
    },
    {
      id: 'parent',
      accessorFn: (row) => row.parent?.name,
      meta: {
        headerTitle: 'Admin.Category.parent',
      },
    },
    {
      accessorKey: 'description',
      meta: {
        headerTitle: 'Admin.Category.description',
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
      type: E_BULK_CATEGORY_TYPE.DELETE,
    },
  ],
  rowActionDefs: [
    {
      ...ROW_ACTION_COMMON.UPDATE,
      type: E_ROW_ACTION_TYPE.UPDATE,
      actionLink: (row) => `/admin/categories/${row.id}`,
    },

    { ...ROW_ACTION_COMMON.DELETE, type: E_ROW_ACTION_TYPE.DELETE },
  ],
}
