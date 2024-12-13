import Image from 'next/image'

import ThemeToggle from '~/app/(admin)/admin/_components/ThemeToggle'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='relative grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='absolute right-4 top-4 md:right-8 md:top-8'>
        <ThemeToggle />
      </div>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 flex items-center justify-center bg-zinc-900'>
          <div className='text-8xl font-semibold'>SStore</div>
        </div>
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Image src='/globe.svg' alt='logo' width={40} height={40} />
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>&ldquo;Simple Store&rdquo;</p>
            <footer className='text-sm'>Hieu Neo</footer>
          </blockquote>
        </div>
      </div>
      <div className='px-5'>{children}</div>
    </div>
  )
}
