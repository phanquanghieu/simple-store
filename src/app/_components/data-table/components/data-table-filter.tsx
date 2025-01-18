'use client'

import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'
import { LuSearch, LuX } from 'react-icons/lu'

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { useTableGlobalFilter } from '../hooks/use-table-global-filter'

export function DataTableFilter({ children }: PropsWithChildren) {
  const {
    globalFilterValue,
    hasFilter,
    setGlobalFilterValue,
    clearGlobalFilter,
  } = useTableGlobalFilter('search')

  const t = useTranslations()
  return (
    <>
      <Input
        onChange={(event) => {
          setGlobalFilterValue(event.target.value || null)
        }}
        className='w-48'
        icon={<LuSearch />}
        placeholder={t('Common.search')}
        value={(globalFilterValue ?? '') as string}
        variant={'icon'}
        variantSize={'sm'}
      />
      {children}
      {hasFilter() && (
        <Button
          onClick={clearGlobalFilter}
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
