import { useLocale } from 'next-intl'
import { useCallback, useMemo } from 'react'

import { isNil } from 'lodash'

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
    (value?: number | string | null) => {
      let _value: number | `${number}`

      if (isNil(value)) {
        _value = 0
      } else if (typeof value === 'string') {
        _value = value as `${number}`
      } else {
        _value = value
      }

      const formattedCurrency = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol',
      }).format(_value)

      return formattedCurrency
    },

    [locale, currencyCode],
  )

  const formatCurrencyWithoutSymbol = useCallback(
    (value?: number | string | null) => {
      let _value: number | `${number}`

      if (isNil(value)) {
        _value = 0
      } else if (typeof value === 'string') {
        _value = value as `${number}`
      } else {
        _value = value
      }

      const numberFormatParts = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).formatToParts(_value)

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
    formatCurrencyWithoutSymbol,
    transformStringToCurrencyNumberString,
  }
}
