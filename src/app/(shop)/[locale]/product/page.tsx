import { useTranslations } from 'next-intl'

export default function ProductPage() {
  const t = useTranslations()
  return <div>{t('Common.Language.vi')}</div>
}

// export function generateStaticParams() {
//   return locales.map((locale) => ({ locale }))
// }
