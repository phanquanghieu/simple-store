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
import { IFormFieldProps } from '../form.interface'

export interface IFFSelectTreeProps
  extends Omit<ISelectTreeProps, 'onChange'>,
    IFormFieldProps {}

export function FFSelectTree({
  name,
  label,
  description,
  ...props
}: IFFSelectTreeProps) {
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
