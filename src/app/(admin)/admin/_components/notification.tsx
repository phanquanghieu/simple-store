'use client'

import { LuBell } from 'react-icons/lu'

import { Button } from '~/app/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/app/_components/ui/dropdown-menu'

export default function Notification() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='relative' size='icon' variant='ghost'>
          <LuBell />
          <div className='absolute bottom-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground'>
            8
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'></DropdownMenuContent>
    </DropdownMenu>
  )
}
