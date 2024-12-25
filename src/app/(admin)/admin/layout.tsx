import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { ThemeProvider } from '~/app/_components/providers/theme-provider'
import { Toaster } from '~/app/_components/ui/toaster'

import '~/app/_styles/globals.css'

export const metadata: Metadata = {
  title: 'Admin Simple Store',
  description: 'Admin Simple Store',
  icons: '/globe.svg',
}

const inter = Inter({
  fallback: ['Arial', 'sans-serif'],
  subsets: ['vietnamese', 'latin'],
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <NuqsAdapter>
            {children}
            <Toaster />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
