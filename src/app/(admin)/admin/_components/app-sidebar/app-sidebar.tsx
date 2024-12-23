'use client'

import * as React from 'react'
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

const menuItems = [
  {
    title: 'Home',
    url: '/admin',
    icon: LuHouse,
    isActive: true,
  },
  {
    title: 'Order',
    url: '#',
    icon: LuShoppingBag,
    isActive: true,
  },
  {
    title: 'Product',
    url: '#',
    icon: LuBox,
    items: [
      {
        title: 'Brand',
        url: '#',
      },
      {
        title: 'Category',
        url: '#',
      },
      {
        title: 'Collection',
        url: '#',
      },
      {
        title: 'Attribute',
        url: '#',
      },
      {
        title: 'Inventory',
        url: '#',
      },
    ],
  },
  {
    title: 'Customer',
    url: '#',
    icon: LuUser,
    items: [
      {
        title: 'Group',
        url: '#',
      },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: LuSlidersHorizontal,
    items: [
      {
        title: 'General',
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
        <NavMain items={menuItems} />
      </SidebarContent>
      <NavFooter />
      <SidebarRail />
    </Sidebar>
  )
}
