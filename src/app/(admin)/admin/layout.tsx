import type { Metadata } from 'next'

import { ThemeProvider } from '~/app/_components/providers/ThemeProvider'
import { Toaster } from '~/app/_components/ui/toaster'

import '~/app/_styles/globals.css'

export const metadata: Metadata = {
  title: 'Admin Simple Store',
  description: 'Admin Simple Store',
  icons: '/globe.svg',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
