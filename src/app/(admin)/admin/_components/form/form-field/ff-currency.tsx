import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { countBy, isNil } from 'lodash'

import { Input, InputProps } from '~/app/_components/ui/input'

import { useCurrency, useNumber } from '~/app/_hooks'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { IFormFieldProps } from '../form.interface'

export function FFCurrency({
  name,
  label,
  placeholder,
  description,
  ...props
}: IFormFieldProps & InputProps) {
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
    if (isNil(formValue) || formValue === '') {
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
      form.setValue(name, null)
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
              {...field}
              onBlur={(e) => handleBlur(e.target.value)}
              onChange={(e) => handleChange(e.target.value)}
              icon={
                <div className='flex w-4 justify-center'>{currencySymbol}</div>
              }
              maxLength={20}
              placeholder={placeholder && t(placeholder)}
              value={value}
              variant={'icon'}
              {...props}
            />
          </FormControl>
          <FormDescription>{description && t(description)}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
