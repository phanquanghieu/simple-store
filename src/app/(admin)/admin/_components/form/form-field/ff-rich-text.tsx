import { useTranslations } from 'next-intl'
import { ComponentProps } from 'react'
import { useFormContext } from 'react-hook-form'

import { Textarea } from '~/app/_components/ui/textarea'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { IFormFieldProps } from '../form.interface'

export function FFRichText({
  name,
  label,
  placeholder,
  description,
  ...props
}: IFormFieldProps & ComponentProps<'textarea'>) {
  const form = useFormContext()

  const t = useTranslations()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label && t(label)}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder && t(placeholder)}
              {...field}
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
