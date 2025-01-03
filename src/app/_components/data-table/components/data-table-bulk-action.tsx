import { ReactNode } from 'react'
import { LuGrip, LuPen, LuTrash } from 'react-icons/lu'

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

  if (countSelectedRow === 0) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='px-2'>
          <LuGrip />
          {'Bulk'}
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
                  {DEFAULT_BULK_ACTION[bulkActionDef.type] ? (
                    <>
                      {DEFAULT_BULK_ACTION[bulkActionDef.type].icon}
                      <span>
                        {DEFAULT_BULK_ACTION[bulkActionDef.type].label}
                      </span>
                    </>
                  ) : (
                    <>
                      {bulkActionDef.icon && <>{bulkActionDef.icon}</>}
                      <span>{bulkActionDef.label}</span>
                    </>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const DEFAULT_BULK_ACTION: Record<string, { label: string; icon: ReactNode }> =
  {
    UPDATE: {
      label: 'Update',
      icon: <LuPen className='text-info' />,
    },
    DELETE: {
      label: 'Delete',
      icon: <LuTrash className='text-destructive' />,
    },
  }
