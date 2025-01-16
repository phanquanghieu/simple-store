import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import {
  ISelectMultiProps,
  SelectMulti,
} from '~/app/_components/ui/select-multi'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'

export interface ISelectMultiFormFieldProps
  extends Omit<ISelectMultiProps, 'onChange'> {
  name: string
  label?: TMessageKey
  description?: TMessageKey
}

export function SelectMultiFormField({
  name,
  label,
  description,
  ...props
}: ISelectMultiFormFieldProps) {
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
            <SelectMulti {...field} {...props} />
          </FormControl>
          <FormDescription>{description && t(description)}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
