import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { ISelect2Props, Select2 } from '~/app/_components/ui/select2'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'

export interface ISelect2FormFieldProps extends ISelect2Props {
  name: string
  label?: TMessageKey
  description?: TMessageKey
}

export function Select2FormField({
  name,
  label,
  description,
  ...props
}: ISelect2FormFieldProps) {
  const { control } = useFormContext()

  const t = useTranslations()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label && t(label)}</FormLabel>
          <FormControl>
            <Select2 {...field} {...props} />
          </FormControl>
          <FormDescription>{description && t(description)}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
