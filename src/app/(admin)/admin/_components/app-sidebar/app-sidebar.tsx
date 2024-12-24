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
  title: string
  url: string
  icon?: IconType
  subMenuItems?: {
    title: string
    url: string
  }[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const menuItems = [
    {
      title: 'Home',
      url: '/admin',
      icon: LuHouse,
    },
    {
      title: 'Orders',
      url: '/admin/orders',
      icon: LuShoppingBag,
    },
    {
      title: 'Products',
      url: '/admin/products',
      icon: LuBox,
      subMenuItems: [
        {
          title: 'Brands',
          url: '/admin/brands',
        },
        {
          title: 'Categories',
          url: '/admin/categories',
        },
        {
          title: 'Collections',
          url: '/admin/collections',
        },
        {
          title: 'Attributes',
          url: '/admin/attributes',
        },
        {
          title: 'Inventories',
          url: '/admin/inventories',
        },
      ],
    },
    {
      title: 'Customers',
      url: '/admin/customers',
      icon: LuUser,
      subMenuItems: [
        {
          title: 'Groups',
          url: '/admin/groups',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: LuSlidersHorizontal,
      subMenuItems: [
        {
          title: 'General',
          url: '#',
        },
      ],
    },
  ]

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
