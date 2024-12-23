'use client'

import { LuLogOut } from 'react-icons/lu'

import { Avatar, AvatarFallback } from '~/app/_components/ui/avatar'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/app/_components/ui/sidebar'

export function NavFooter() {
  const user = {
    username: 'hieuneo',
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          >
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarFallback className='rounded-lg'>
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left leading-tight'>
              <span className='truncate font-semibold'>{user.username}</span>
            </div>
            <LuLogOut className='mr-2' />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
