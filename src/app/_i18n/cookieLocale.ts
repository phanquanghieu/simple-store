'use server'

import { cookies } from 'next/headers'

import { TLocale, defaultLocale } from './config'

const COOKIE_NAME_ADMIN_LOCALE = 'ss-admin-locale'

export async function getCookieAdminLocate() {
  return (await cookies()).get(COOKIE_NAME_ADMIN_LOCALE)?.value || defaultLocale
}

export async function setCookieAdminLocate(locale: TLocale) {
  ;(await cookies()).set(COOKIE_NAME_ADMIN_LOCALE, locale)
}
