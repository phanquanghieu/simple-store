import { useLocale } from 'next-intl'
import { useCallback, useMemo } from 'react'

import { useNumber } from './use-number'

export function useCurrency() {
  const locale = useLocale()
  const { transformStringToNumberString } = useNumber()
  const currencyCode = 'USD'

  const currencySymbol = useMemo(() => {
    const currencySymbol =
      new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol',
      })
        .formatToParts(1)
        .find((part) => part.type === 'currency')?.value ?? ''

    return currencySymbol
  }, [currencyCode])

  const formatCurrency = useCallback(
    (value: string | number) => {
      const formattedCurrency = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol',
      }).format(value as `${number}`)

      return formattedCurrency
    },

    [locale, currencyCode],
  )

  const formatCurrencyNumberString = useCallback(
    (value: number | string) => {
      const numberFormatParts = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).formatToParts(value as `${number}`)

      const formattedCurrencyWithoutSymbol = numberFormatParts
        .filter((part) =>
          (
            [
              'integer',
              'group',
              'decimal',
              'fraction',
            ] as Intl.NumberFormatPartTypes[]
          ).includes(part.type),
        )
        .map((part) => part.value)
        .join('')

      return formattedCurrencyWithoutSymbol
    },

    [locale, currencyCode],
  )

  const transformStringToCurrencyNumberString = useCallback(
    (rawString: string): `${number}` => {
      const numberString = transformStringToNumberString(rawString)

      const numberFormatParts = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).formatToParts(numberString)

      const currencyNumberString = numberFormatParts.reduce(
        (currencyNumberString, part) => {
          if (part.type === 'integer') {
            currencyNumberString += part.value
          }
          if (part.type === 'decimal') {
            currencyNumberString += '.'
          }
          if (part.type === 'fraction') {
            currencyNumberString += part.value
          }
          return currencyNumberString
        },
        '',
      )
      return currencyNumberString as `${number}`
    },
    [locale, currencyCode, transformStringToNumberString],
  )

  return {
    currencySymbol,
    formatCurrency,
    formatCurrencyNumberString,
    transformStringToCurrencyNumberString,
  }
}
