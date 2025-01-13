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

import { Link, locales, usePathname } from '~/app/_i18n'

export default function LanguageToggle({
  hideBorder = false,
}: {
  hideBorder?: boolean
}) {
  const currLocale = useLocale()
  const pathname = usePathname()

  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant={hideBorder ? 'ghost' : 'outline'}>
          <LuLanguages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {locales.map((locale) => (
          <Link href={pathname} key={locale} locale={locale}>
            <DropdownMenuItem disabled={locale === currLocale}>
              {t(`Common.Language.${locale}`)}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
