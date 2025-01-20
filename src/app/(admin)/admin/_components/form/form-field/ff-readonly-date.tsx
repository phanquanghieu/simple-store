import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { Input } from '~/app/_components/ui/input'

import { useDatetime } from '~/app/_hooks'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { IFormFieldProps } from '../form.interface'

export function FFReadonlyDate({ name, label, description }: IFormFieldProps) {
  const form = useFormContext()
  const { formatDatetime } = useDatetime()

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
              disabled
              value={field.value ? formatDatetime(field.value) : ''}
            />
          </FormControl>
          <FormDescription>{description && t(description)}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
