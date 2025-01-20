import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { Input, InputProps } from '~/app/_components/ui/input'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { IFormFieldProps } from '../form.interface'

export function FFInput({
  name,
  label,
  placeholder,
  description,
  ...props
}: IFormFieldProps & InputProps) {
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
            <Input
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
