import { useLocale } from 'next-intl'
import { useCallback, useMemo } from 'react'

export function useNumber() {
  const locale = useLocale()

  const numberFormatPartValue = useMemo(() => {
    const numberFormatParts = new Intl.NumberFormat(locale, {
      style: 'decimal',
    }).formatToParts(12345.6)

    const group = numberFormatParts.find((part) => part.type === 'group')!.value
    const decimal = numberFormatParts.find(
      (part) => part.type === 'decimal',
    )!.value

    return {
      group,
      decimal,
    }
  }, [locale])

  const transformStringToNumberString = useCallback(
    (rawString: string): `${number}` => {
      const numberString = rawString
        .replace(/[^0-9.,]/g, '')
        .replaceAll(numberFormatPartValue.group, '')
        .replaceAll(numberFormatPartValue.decimal, '.') as `${number}`
      return numberString
    },
    [numberFormatPartValue],
  )

  const transformStringToFormattedNumberString = useCallback(
    (rawString: string): string => {
      const numberString = transformStringToNumberString(rawString)

      const formattedNumberString = new Intl.NumberFormat(locale, {
        style: 'decimal',
        roundingMode: 'trunc',
      }).format(numberString)

      return formattedNumberString
    },
    [locale, transformStringToNumberString],
  )

  return {
    numberFormatPartValue,
    transformStringToNumberString,
    transformStringToFormattedNumberString,
  }
}
