import type { Metadata } from 'next'

import '~/app/_styles/globals.css'

export const metadata: Metadata = {
  title: 'Simple Store',
  description: 'Simple Store',
  icons: '/globe.svg',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
