import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { PropsWithChildren, Suspense } from 'react'

import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Toaster } from '~/app/_components/ui/toaster'

import { ThemeProvider } from '~/app/(admin)/admin/_providers/theme.provider'
import '~/app/_styles/globals.css'

export const metadata: Metadata = {
  title: 'Simple Store Admin',
  description: 'Simple Store Admin',
  icons: '/logo.svg',
}

const inter = Inter({
  fallback: ['Arial', 'sans-serif'],
  subsets: ['vietnamese', 'latin'],
})

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body>
        <Suspense>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <NuqsAdapter>
                {children}
                <Toaster />
              </NuqsAdapter>
            </ThemeProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  )
}
