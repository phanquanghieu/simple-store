import { useTranslations } from 'next-intl'
import { LuGrip } from 'react-icons/lu'

import { entries } from 'lodash'

import { Button } from '../../ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { useTable } from '../data-table.context'

export function DataTableBulkAction() {
  const { table } = useTable()

  const tableMeta = table.options.meta

  const selectedRowIds = entries(table.getState().rowSelection)
    .filter(([, isSelected]) => isSelected)
    .map(([rowId]) => rowId)
  const countSelectedRow = selectedRowIds.length

  const t = useTranslations()

  if (countSelectedRow === 0) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='px-2'>
          <LuGrip />
          {t('Common.bulk')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0' align='end'>
        <Command>
          <CommandList className='max-h-full'>
            <CommandGroup className='max-h-[18.75rem] overflow-y-auto overflow-x-hidden'>
              {tableMeta?.bulkActionDefs?.map((bulkActionDef) => (
                <CommandItem
                  key={bulkActionDef.type}
                  onSelect={() =>
                    tableMeta.setBulkAction?.({
                      type: bulkActionDef.type,
                      rowIds: selectedRowIds,
                    })
                  }
                >
                  {bulkActionDef.icon && <>{bulkActionDef.icon}</>}
                  <span>{bulkActionDef.label && t(bulkActionDef.label)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
