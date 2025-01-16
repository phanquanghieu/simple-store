import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { ISelectTreeProps, SelectTree } from '~/app/_components/ui/select-tree'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'

export interface ISelectTreeFormFieldProps
  extends Omit<ISelectTreeProps, 'onChange'> {
  name: string
  label?: TMessageKey
  description?: TMessageKey
}

export function SelectTreeFormField({
  name,
  label,
  description,
  ...props
}: ISelectTreeFormFieldProps) {
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
            <SelectTree {...field} {...props} />
          </FormControl>
          <FormDescription>{description && t(description)}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
