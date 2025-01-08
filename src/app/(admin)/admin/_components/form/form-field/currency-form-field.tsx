import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

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
    formatCurrencyWithoutSymbol,
    transformStringToCurrencyNumberString,
  } = useCurrency()
  const { numberFormatPartValue, transformStringToFormattedNumberString } =
    useNumber()

  const formValue = form.watch(name)

  useEffect(() => {
    setValue(formatCurrencyWithoutSymbol(formValue))
  }, [formValue, formatCurrencyWithoutSymbol, setValue])

  const handleChange = (rawValue: string) => {
    if (rawValue === '') {
      setValue('')
      return
    }

    let _value = transformStringToFormattedNumberString(rawValue)

    if (rawValue.endsWith(numberFormatPartValue.decimal)) {
      _value += numberFormatPartValue.decimal
    }
    setValue(_value)
  }

  const handleBlur = (rawValue: string) => {
    if (rawValue === '') {
      setValue('')
      return
    }

    const currencyNumberString = transformStringToCurrencyNumberString(rawValue)
    form.setValue(name, currencyNumberString)
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
