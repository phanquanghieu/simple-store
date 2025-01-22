import { HTMLAttributes } from 'react'

import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '~/app/_libs/utils'

const textVariants = cva('', {
  variants: {
    variant: {
      default: 'text-base text-primary',
      description: 'text-sm italic text-warning',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface ITextProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof textVariants> {}

export function Text({ className, variant, ...props }: ITextProps) {
  return (
    <span className={cn(textVariants({ variant }), className)} {...props} />
  )
}
