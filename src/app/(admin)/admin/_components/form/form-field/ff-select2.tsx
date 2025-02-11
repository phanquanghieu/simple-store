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
import { IFormFieldProps } from '../form.interface'

export interface IFFSelect2Props extends ISelect2Props, IFormFieldProps {}

export function FFSelect2({
  name,
  label,
  description,
  ...props
}: IFFSelect2Props) {
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
