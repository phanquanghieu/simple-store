import Image from 'next/image'
import { PropsWithChildren } from 'react'

import LanguageToggle from '../../_components/language-toggle'
import ThemeToggle from '../../_components/theme-toggle'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className='relative grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='absolute right-4 top-4 flex gap-3 md:right-8 md:top-8'>
        <ThemeToggle />
        <LanguageToggle />
      </div>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-zinc-900'>
          <div className='flex items-end justify-end'>
            <div className='text-line text-[16rem] font-semibold leading-none'>
              S
            </div>
            <div className='pb-5'>
              <div className='text-8xl font-semibold'>imple</div>
              <div className='text-8xl font-semibold'>tore</div>
            </div>
          </div>
          <div className='text-2xl'>Admin</div>
        </div>
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Image src='/logo.svg' alt='logo' width={40} height={40} />
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <footer className='text-sm'>Hieu Neo</footer>
          </blockquote>
        </div>
      </div>
      <div className='px-5'>{children}</div>
    </div>
  )
}
