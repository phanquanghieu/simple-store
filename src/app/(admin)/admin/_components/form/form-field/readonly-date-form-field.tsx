import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { Input } from '~/app/_components/ui/input'

import { useDatetime } from '~/app/_hooks/use-datetime'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'

export function ReadonlyDateFormField({
  name,
  label,
}: {
  name: string
  label?: TMessageKey
}) {
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
