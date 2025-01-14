'use client'

import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'
import { LuSearch, LuX } from 'react-icons/lu'

import { GlobalFilterState } from '@tanstack/react-table'
import { compact, isEmpty, mapValues, values } from 'lodash'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { useTable } from '../data-table.context'

export function DataTableFilter({ children }: PropsWithChildren) {
  const { table } = useTable()
  const globalFilter = table.getState().globalFilter
  const hasFilter = !isEmpty(compact(values(globalFilter)))

  const t = useTranslations()
  return (
    <>
      <Input
        onChange={(event) => {
          table.setGlobalFilter({ search: event.target.value || null })
        }}
        className='w-48'
        icon={<LuSearch />}
        placeholder={t('Common.search')}
        value={globalFilter.search ?? ''}
        variant={'icon'}
        variantSize={'sm'}
      />
      {children}
      {hasFilter && (
        <Button
          onClick={() =>
            table.setGlobalFilter((prev: GlobalFilterState) =>
              mapValues(prev, () => null),
            )
          }
          className='size-8 border-dashed'
          size={'icon'}
          variant={'outline'}
        >
          <LuX />
        </Button>
      )}
    </>
  )
}
