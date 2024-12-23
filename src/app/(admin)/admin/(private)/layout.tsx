import { PropsWithChildren } from 'react'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/app/_components/ui/sidebar'

import { AppSidebar } from '~/app/(admin)/admin/_components/app-sidebar/app-sidebar'

import LanguageToggle from '../_components/language-toggle'
import Notification from '../_components/notification'
import ThemeToggle from '../_components/theme-toggle'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-12 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-2'>
            <SidebarTrigger />
          </div>
          <div className='flex items-center px-3'>
            <LanguageToggle />
            <ThemeToggle hideBorder />
            <Notification />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
