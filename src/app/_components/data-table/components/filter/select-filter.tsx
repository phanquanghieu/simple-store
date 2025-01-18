import { useTranslations } from 'next-intl'
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

const OPTION_LENGTH_SHOW_SEARCH = 10

export function SelectFilter({
  title,
  queryField,
  options,
  isSingleSelect = false,
  isOptionLabelMessageKey = false,
}: {
  title: TMessageKey
  queryField: string
  options: IOption[]
  isSingleSelect?: boolean
  isOptionLabelMessageKey?: boolean
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

  const t = useTranslations()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='border-dashed px-2' size='sm' variant='outline'>
          <LuListFilter />
          {t(title)}
          {selectedOptionValuesSet.size > 0 && (
            <>
              <Separator className='h-4' orientation='vertical' />

              <div className='space-x-1'>
                {options
                  .filter((option) => selectedOptionValuesSet.has(option.value))
                  .map((option) => (
                    <Badge
                      className='rounded-sm px-1 font-normal'
                      key={option.value}
                      variant='secondary'
                    >
                      {isOptionLabelMessageKey
                        ? t(option.label as TMessageKey)
                        : option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-fit max-w-md p-0'>
        <Command>
          {options.length > OPTION_LENGTH_SHOW_SEARCH && (
            <CommandInput placeholder={t('Common.search')} />
          )}
          <CommandList className='max-h-full'>
            <CommandEmpty>{t('Admin.Common.noResultFound')}</CommandEmpty>
            <CommandGroup className='max-h-[18.75rem] overflow-y-auto overflow-x-hidden truncate'>
              {options.map((option) => {
                const isSelected = selectedOptionValuesSet.has(option.value)

                return (
                  <CommandItem
                    onSelect={() => handleSelect(option.value)}
                    key={option.value}
                    value={option.value}
                  >
                    <Checkbox
                      checked={isSelected}
                      variant={isSingleSelect ? 'circle' : 'default'}
                    />
                    <span>
                      {isOptionLabelMessageKey
                        ? t(option.label as TMessageKey)
                        : option.label}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedOptionValuesSet.size > 0 && (
              <>
                <CommandSeparator alwaysRender />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className='justify-center text-center'
                  >
                    {t('Common.clear')}
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
