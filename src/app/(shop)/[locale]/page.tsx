'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { Button } from '../../_components/ui/button'
import { useToast } from '../../_hooks'
import { cn } from '../../_libs/utils'
import LanguageToggle from './_components/language-toggle'

export default function ShopPage() {
  const { toast } = useToast()

  const t = useTranslations()

  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'>
      <div>Shop</div>
      <LanguageToggle />
      <Button className={cn()}>{t('Common.update')}</Button>
      <Link href={'/admin'}>admin</Link>
    </div>
  )
}
