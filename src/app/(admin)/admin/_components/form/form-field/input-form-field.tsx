import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { Input } from '~/app/_components/ui/input'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'

export function InputFormField({
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
            <Input placeholder={placeholder && t(placeholder)} {...field} />
          </FormControl>
          <FormDescription>{description && t(description)}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
