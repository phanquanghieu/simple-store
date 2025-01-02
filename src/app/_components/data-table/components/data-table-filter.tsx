'use client'

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

  return (
    <>
      <Input
        className='w-48'
        variant={'icon'}
        variantSize={'sm'}
        placeholder='Search...'
        icon={<LuSearch />}
        value={globalFilter.search ?? ''}
        onChange={(event) => {
          table.setGlobalFilter({ search: event.target.value || null })
        }}
      />
      {children}
      {hasFilter && (
        <Button
          size={'icon'}
          variant={'outline'}
          className='size-8 border-dashed'
          onClick={() =>
            table.setGlobalFilter((prev: GlobalFilterState) =>
              mapValues(prev, () => null),
            )
          }
        >
          <LuX />
        </Button>
      )}
    </>
  )
}
