'use client'

import * as React from 'react'
import { LuCheck, LuCircle } from 'react-icons/lu'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '~/app/_libs/utils'

const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  {
    variants: {
      variant: {
        default: 'rounded-sm',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    className={cn(checkboxVariants({ variant, className }))}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        'flex h-3.5 w-3.5 items-center justify-center text-current',
      )}
    >
      {variant === 'circle' ? (
        <LuCircle className='h-3.5 w-3.5' />
      ) : (
        <LuCheck className='h-3.5 w-3.5' />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
