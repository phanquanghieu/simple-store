import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import { Checkbox, CheckboxProps } from '~/app/_components/ui/checkbox'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'
import { IFormFieldProps } from '../form.interface'

export function FFCheckbox({
  name,
  label,
  description,
  ...props
}: IFormFieldProps & CheckboxProps) {
  const form = useFormContext()

  const t = useTranslations()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
          <FormControl>
            <Checkbox
              {...field}
              onCheckedChange={field.onChange}
              checked={field.value}
              {...props}
            />
          </FormControl>
          <div className='space-y-1 leading-none'>
            <FormLabel>{label && t(label)}</FormLabel>
            <FormDescription>{description && t(description)}</FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}
