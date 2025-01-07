import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '~/app/_libs/utils'

const Container = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('container mx-auto', className)} {...props}>
      {children}
    </div>
  )
}

const gridVariants = cva('grid grid-cols-1 gap-4', {
  variants: {
    grid: {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
    },
  },
  defaultVariants: {
    grid: 1,
  },
})

const Grid = ({
  children,
  grid,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof gridVariants>) => {
  return (
    <div className={cn(gridVariants({ grid }), className)} {...props}>
      {children}
    </div>
  )
}

const colVariants = cva('col-span-1', {
  variants: {
    col: {
      1: 'lg:col-span-1',
      2: 'lg:col-span-2',
      3: 'lg:col-span-3',
      4: 'lg:col-span-4',
      5: 'lg:col-span-5',
      6: 'lg:col-span-6',
    },
  },
  defaultVariants: {
    col: 1,
  },
})

const Col = ({
  children,
  col,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof colVariants>) => {
  return (
    <div className={cn(colVariants({ col }), className)} {...props}>
      {children}
    </div>
  )
}

export { Col, Container, Grid }
