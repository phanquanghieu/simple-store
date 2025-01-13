import React from 'react'

import { cn } from '~/app/_libs/utils'

export function Spinner({
  className,
  ...props
}: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      className={cn('h-4 w-4 animate-spin', className)}
      fill='none'
      height='24'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      width='24'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  )
}
