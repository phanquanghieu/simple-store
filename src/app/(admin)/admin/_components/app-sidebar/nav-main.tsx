'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import { LuChevronRight } from 'react-icons/lu'

import {
  Collapsible,
  CollapsibleContent,
} from '~/app/_components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/app/_components/ui/sidebar'

import { IMenuItem } from './app-sidebar'

export function NavMain({ menuItems }: { menuItems: IMenuItem[] }) {
  const _pathname = usePathname()
  const [pathname, setPathname] = useState('')

  useEffect(() => {
    setPathname(_pathname)
  }, [_pathname])

  const t = useTranslations()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {menuItems.map((menuItem) => (
          <Fragment key={menuItem.url}>
            {menuItem.subMenuItems ? (
              <Collapsible
                asChild
                className='group/collapsible'
                open={
                  menuItem.url === pathname ||
                  menuItem.subMenuItems.some(
                    (subMenuItem) => subMenuItem.url === pathname,
                  )
                }
              >
                <SidebarMenuItem>
                  <Link href={menuItem.url}>
                    <SidebarMenuButton
                      tooltip={t(menuItem.title)}
                      isActive={pathname === menuItem.url}
                    >
                      {menuItem.icon && <menuItem.icon />}
                      {t(menuItem.title)}
                      <LuChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </Link>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menuItem.subMenuItems?.map((subMenuItem) => (
                        <SidebarMenuSubItem key={subMenuItem.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subMenuItem.url}
                          >
                            <Link href={subMenuItem.url}>
                              {t(subMenuItem.title)}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <Link href={menuItem.url}>
                <SidebarMenuButton
                  tooltip={t(menuItem.title)}
                  isActive={pathname === menuItem.url}
                >
                  {menuItem.icon && <menuItem.icon />}
                  {t(menuItem.title)}
                </SidebarMenuButton>
              </Link>
            )}
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
