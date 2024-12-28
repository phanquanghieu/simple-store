'use client'

import { LuLogOut } from 'react-icons/lu'

import { logoutAction } from '~/server/actions/auth.action'

import { Avatar, AvatarFallback } from '~/app/_components/ui/avatar'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/app/_components/ui/sidebar'
import { Skeleton } from '~/app/_components/ui/skeleton'

import { useGetMe } from '~/app/_apis/admin/admin/useGetMe'

export function NavFooter() {
  const { data: admin, isLoading } = useGetMe()

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
                {admin?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left leading-tight'>
              {isLoading && <Skeleton className='h-4' />}
              {admin && (
                <span className='truncate font-semibold'>{admin.username}</span>
              )}
            </div>
            <LuLogOut className='mr-2' onClick={logoutAction} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
