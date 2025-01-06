'use client'

import * as React from 'react'
import { IconType } from 'react-icons/lib'
import {
  LuBox,
  LuHouse,
  LuShoppingBag,
  LuSlidersHorizontal,
  LuUser,
} from 'react-icons/lu'

import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from '~/app/_components/ui/sidebar'

import { NavFooter } from './nav-footer'
import { NavHeader } from './nav-header'
import { NavMain } from './nav-main'

export type IMenuItem = {
  title: TMessageKey
  url: string
  icon?: IconType
  subMenuItems?: {
    title: TMessageKey
    url: string
  }[]
}

const menuItems: IMenuItem[] = [
  {
    title: 'Admin.SideBar.home',
    url: '/admin',
    icon: LuHouse,
  },
  {
    title: 'Admin.SideBar.orders',
    url: '/admin/orders',
    icon: LuShoppingBag,
  },
  {
    title: 'Admin.SideBar.products',
    url: '/admin/products',
    icon: LuBox,
    subMenuItems: [
      {
        title: 'Admin.SideBar.brands',
        url: '/admin/brands',
      },
      {
        title: 'Admin.SideBar.categories',
        url: '/admin/categories',
      },
      {
        title: 'Admin.SideBar.collections',
        url: '/admin/collections',
      },
      {
        title: 'Admin.SideBar.attributes',
        url: '/admin/attributes',
      },
      {
        title: 'Admin.SideBar.inventories',
        url: '/admin/inventories',
      },
    ],
  },
  {
    title: 'Admin.SideBar.customers',
    url: '/admin/customers',
    icon: LuUser,
    subMenuItems: [
      {
        title: 'Admin.SideBar.groups',
        url: '/admin/groups',
      },
    ],
  },
  {
    title: 'Admin.SideBar.settings',
    url: '/admin/settings',
    icon: LuSlidersHorizontal,
    subMenuItems: [
      {
        title: 'Admin.SideBar.general',
        url: '#',
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <NavHeader />
      <SidebarContent>
        <NavMain menuItems={menuItems} />
      </SidebarContent>
      <NavFooter />
      <SidebarRail />
    </Sidebar>
  )
}
