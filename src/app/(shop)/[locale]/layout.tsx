import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import { PropsWithChildren, Suspense } from 'react'

import '~/app/_styles/globals.css'

import { TLocale, locales } from '../../_i18n'

export const metadata: Metadata = {
  title: 'Simple Store',
  description: 'Simple Store',
  icons: '/logo.svg',
}

const inter = Inter({
  fallback: ['Arial', 'sans-serif'],
  subsets: ['vietnamese', 'latin'],
})

export default async function RootLayout({
  children,
  params,
}: PropsWithChildren<INextRouteParams<{ locale: string }>>) {
  const locale = (await params).locale

  if (!locales.includes(locale as TLocale)) {
    redirect('/')
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.className}>
      <body>
        <Suspense>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  )
}

// export function generateStaticParams() {
//   return locales.map((locale) => ({ locale }))
// }
