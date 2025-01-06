import { getRequestConfig } from 'next-intl/server'

import { TLocale, defaultLocale, locales } from './config'
import { getCookieAdminLocate } from './cookieLocale'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale) {
    locale = await getCookieAdminLocate()
  }

  if (!locales.includes(locale as TLocale)) {
    locale = defaultLocale
  }

  let messages

  const defaultLocaleMessages = (
    await import(`../../../messages/${defaultLocale}.json`)
  ).default

  if (locale === defaultLocale) {
    messages = defaultLocaleMessages
  } else {
    const localeMessage = (await import(`../../../messages/${locale}.json`))
      .default

    messages = defaultsDeep({}, localeMessage, defaultLocaleMessages)
  }

  return {
    locale,
    messages,
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultsDeep = (target: any, ...sources: any[]) => {
  sources.forEach((source) => {
    if (source && typeof source === 'object') {
      Object.keys(source).forEach((key) => {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          if (!target[key] || typeof target[key] !== 'object') {
            target[key] = {}
          }
          defaultsDeep(target[key], source[key])
        } else if (target[key] === undefined) {
          target[key] = source[key]
        }
      })
    }
  })

  return target
}
