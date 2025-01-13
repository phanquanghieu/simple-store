import * as React from 'react'

import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '~/app/_libs/utils'

const inputVariants = cva(
  'invalid: flex w-full rounded-md border border-input bg-background text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: '',
        icon: '!pl-8',
      },
      variantSize: {
        default: 'h-9 px-3 py-1',
        sm: 'h-8 px-3 py-1',
        lg: 'h-10 px-4 py-1',
      },
      isError: {
        false: '',
        true: 'border-destructive ring-destructive focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
      variantSize: 'default',
      isError: false,
    },
  },
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className, variant, variantSize, isError, type, ...props }, ref) => {
    return (
      <div className='relative'>
        <input
          className={cn(
            inputVariants({ variantSize, variant, isError, className }),
          )}
          ref={ref}
          type={type}
          {...props}
        />
        {icon && (
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'>
            {icon}
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
