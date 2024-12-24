'use client'

import { useEffect, useState } from 'react'
import { LuLogOut } from 'react-icons/lu'

import { IAdminRes } from '~/shared/dto/admin/req'

import { logoutAction } from '~/server/actions/auth.action'

import { Avatar, AvatarFallback } from '~/app/_components/ui/avatar'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/app/_components/ui/sidebar'
import { Skeleton } from '~/app/_components/ui/skeleton'

export function NavFooter() {
  const [admin, setAdmin] = useState<IAdminRes | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/me')
      const data = await res.json()
      setAdmin(data.data)
    }
    fetchData()
  }, [])

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
              {admin ? (
                <span className='truncate font-semibold'>
                  {admin?.username}
                </span>
              ) : (
                <Skeleton className='h-4' />
              )}
            </div>
            <LuLogOut className='mr-2' onClick={logoutAction} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
