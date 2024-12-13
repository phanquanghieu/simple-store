'use client'

import Link from 'next/link'

import { Button } from '../_components/ui/button'
import { useToast } from '../_hooks/useToast'
import { cn } from '../_libs/utils'

export default function Home() {
  const { toast } = useToast()
  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'>
      <div>lrem ipsum dolor sit amet</div>
      <Button
        className={cn()}
        onClick={() => toast({ description: 'dd', title: 'dd' })}
      >
        Button
      </Button>
      <Link href={'/admin'}>admin</Link>
    </div>
  )
}
