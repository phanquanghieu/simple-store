import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

import { defaultLocale, locales } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
})

export const {
  Link,
  usePathname,
  useRouter,
  getPathname,
  redirect,
  permanentRedirect,
} = createNavigation(routing)
