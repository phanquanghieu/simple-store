import { useTranslations } from 'next-intl'
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

export function RichTextFormField({
  name,
  label,
  placeholder,
  description,
  ...props
}: {
  name: string
  label?: TMessageKey
  placeholder?: TMessageKey
  description?: TMessageKey
} & React.ComponentProps<'textarea'>) {
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
