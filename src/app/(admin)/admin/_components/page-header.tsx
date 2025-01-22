import Link from 'next/link'
import { PropsWithChildren, ReactNode } from 'react'
import { LuArrowLeft } from 'react-icons/lu'

import { Button } from '~/app/_components/ui/button'

import { cn } from '~/app/_libs/utils'

export function PageHeader({
  children,
  title,
  backUrl,
  className,
}: PropsWithChildren<{
  title: ReactNode
  backUrl?: string
  className?: string
}>) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className='flex items-center'>
        {backUrl && (
          <Link href={backUrl}>
            <Button size={'icon'} variant={'ghost'}>
              <LuArrowLeft />
            </Button>
          </Link>
        )}
        <h3 className='text-xl font-semibold'>{title}</h3>
      </div>
      <div className='flex gap-3'>{children}</div>
    </div>
  )
}
