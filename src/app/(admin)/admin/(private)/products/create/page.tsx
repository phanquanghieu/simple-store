'use client'

import { useTranslations } from 'next-intl'

import { Button } from '~/app/_components/ui/button'

import { PageHeader } from '../../../_components/page-header'

export default function Page() {
  const t = useTranslations()

  return (
    <>
      <PageHeader title='Create Product' backUrl='/admin/products'>
        <Button>{t('Common.save')}</Button>
      </PageHeader>
    </>
  )
}
