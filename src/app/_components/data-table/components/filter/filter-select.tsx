import { useMemo } from 'react'
import { LuListFilter } from 'react-icons/lu'

import { GlobalFilterState } from '@tanstack/react-table'

import { zodt } from '~/shared/libs/zod'

import { Badge } from '~/app/_components/ui/badge'
import { Button } from '~/app/_components/ui/button'
import { Checkbox } from '~/app/_components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/app/_components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/app/_components/ui/popover'
import { Separator } from '~/app/_components/ui/separator'

import { IOption } from '~/app/_interfaces/common.interface'

import { useTable } from '../../data-table.context'

const OPTION_LENGTH_SHOW_SEARCH = 2

export function FilterSelect({
  title,
  queryField,
  options,
  isSingleSelect = false,
}: {
  title: string
  queryField: string
  options: IOption[]
  isSingleSelect?: boolean
}) {
  const { table } = useTable()
  const optionValues = useMemo(() => options.map((x) => x.value), [options])

  const globalFilterValue = (
    table.getState().globalFilter as GlobalFilterState
  )?.[queryField]

  let selectedOptionValues = globalFilterValue
    ? zodt.toArray(globalFilterValue)
    : []

  selectedOptionValues = selectedOptionValues.filter((selectedOption) =>
    optionValues.includes(selectedOption),
  )

  const selectedOptionValuesSet = new Set(selectedOptionValues)

  const handleSelect = (value: string | number) => {
    if (isSingleSelect) {
      table.setGlobalFilter({ [queryField]: value })
    } else {
      if (selectedOptionValuesSet.has(value)) {
        selectedOptionValuesSet.delete(value)
      } else {
        selectedOptionValuesSet.add(value)
      }

      table.setGlobalFilter({
        [queryField]: selectedOptionValuesSet.size
          ? Array.from(selectedOptionValuesSet)
          : null,
      })
    }
  }

  const handleClear = () => {
    table.setGlobalFilter({ [queryField]: null })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='border-dashed px-2'>
          <LuListFilter />
          {title}
          {selectedOptionValuesSet.size > 0 && (
            <>
              <Separator orientation='vertical' className='h-4' />

              <div className='space-x-1'>
                {options
                  .filter((option) => selectedOptionValuesSet.has(option.value))
                  .map((option) => (
                    <Badge
                      key={option.value}
                      variant='secondary'
                      className='rounded-sm px-1 font-normal'
                    >
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit max-w-md p-0' align='start'>
        <Command>
          {options.length > OPTION_LENGTH_SHOW_SEARCH && (
            <CommandInput placeholder={'Search'} />
          )}
          <CommandList className='max-h-full'>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup className='max-h-[18.75rem] overflow-y-auto overflow-x-hidden truncate'>
              {options.map((option) => {
                const isSelected = selectedOptionValuesSet.has(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Checkbox
                      variant={isSingleSelect ? 'circle' : 'default'}
                      checked={isSelected}
                    />
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedOptionValuesSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className='justify-center text-center'
                  >
                    Clear
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
