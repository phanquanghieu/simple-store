'use client'

import { useLocale, useTranslations } from 'next-intl'
import { LuLanguages } from 'react-icons/lu'

import { Button } from '~/app/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/app/_components/ui/dropdown-menu'

import { TLocale, locales, setCookieAdminLocate } from '~/app/_i18n'

export default function LanguageToggle({
  hideBorder = false,
}: {
  hideBorder?: boolean
}) {
  const t = useTranslations()
  const currLocale = useLocale()

  const handleChangeLanguage = async (locale: TLocale) => {
    await setCookieAdminLocate(locale)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant={hideBorder ? 'ghost' : 'outline'}>
          <LuLanguages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {locales.map((locale) => (
          <DropdownMenuItem
            onClick={() => handleChangeLanguage(locale)}
            disabled={locale === currLocale}
            key={locale}
          >
            {t(`Common.Language.${locale}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
