'use client'

import * as React from 'react'

import * as LabelPrimitive from '@radix-ui/react-label'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '~/app/_libs/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      size: {
        default: '',
        lg: 'text-base font-medium',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, size, ...props }, ref) => (
  <LabelPrimitive.Root
    className={cn(labelVariants({ size }), className)}
    ref={ref}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
