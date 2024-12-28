import { PropsWithChildren } from 'react'

import ReactQueryProvider from '~/app/_components/providers/react-query-provider'
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
    <ReactQueryProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between border-b bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-2'>
              <SidebarTrigger />
            </div>
            <div className='flex items-center px-3'>
              <LanguageToggle />
              <ThemeToggle hideBorder />
              <Notification />
            </div>
          </header>
          <div className='flex flex-col gap-4 p-4'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ReactQueryProvider>
  )
}
