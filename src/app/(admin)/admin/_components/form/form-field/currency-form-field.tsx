import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { countBy } from 'lodash'

import { Input } from '~/app/_components/ui/input'

import { useCurrency } from '~/app/_hooks/use-currency'
import { useNumber } from '~/app/_hooks/use-number'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'

export function CurrencyFormField({
  name,
  label,
  placeholder,
  description,
}: {
  name: string
  label?: TMessageKey
  placeholder?: TMessageKey
  description?: TMessageKey
}) {
  const [value, setValue] = useState('')
  const form = useFormContext()
  const {
    currencySymbol,
    formatCurrencyNumberString,
    transformStringToCurrencyNumberString,
  } = useCurrency()
  const { numberFormatPartValue, transformStringToFormattedNumberString } =
    useNumber()

  const formValue = form.watch(name)

  useEffect(() => {
    if (formValue === '') {
      setValue('')
    } else {
      setValue(formatCurrencyNumberString(formValue))
    }
  }, [formValue, formatCurrencyNumberString, setValue])

  const handleChange = (rawValue: string) => {
    if (rawValue === '') {
      setValue('')
    } else {
      if (rawValue.endsWith(numberFormatPartValue.decimal)) {
        const countDecimal =
          countBy(rawValue)[numberFormatPartValue.decimal] ?? 0
        if (countDecimal <= 1) {
          setValue(
            `${transformStringToFormattedNumberString(rawValue)}${numberFormatPartValue.decimal}`,
          )
        } else {
          setValue(rawValue.slice(0, -1))
        }
      } else {
        setValue(transformStringToFormattedNumberString(rawValue))
      }
    }
  }

  const handleBlur = (rawValue: string) => {
    if (rawValue === '') {
      setValue('')
      form.setValue(name, '')
    } else {
      const currencyNumberString =
        transformStringToCurrencyNumberString(rawValue)

      setValue(formatCurrencyNumberString(currencyNumberString))
      form.setValue(name, currencyNumberString)
    }
  }

  const t = useTranslations()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label && t(label)}</FormLabel>
          <FormControl>
            <Input
              variant={'icon'}
              placeholder={placeholder && t(placeholder)}
              icon={
                <div className='flex w-4 justify-center'>{currencySymbol}</div>
              }
              {...field}
              value={value}
              maxLength={20}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={(e) => handleBlur(e.target.value)}
            />
          </FormControl>
          <FormDescription>{description && t(description)}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
