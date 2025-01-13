'use client'

import Image from 'next/image'
import Link from 'next/link'

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/app/_components/ui/sidebar'

export function NavHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href={'/'}>
            <SidebarMenuButton
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              size='lg'
            >
              <Image alt='logo' height={32} src={'/logo.svg'} width={32} />
              <div className='grid flex-1 text-left text-lg leading-tight'>
                <span className='truncate font-semibold'>
                  Simple Store Admin
                </span>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
