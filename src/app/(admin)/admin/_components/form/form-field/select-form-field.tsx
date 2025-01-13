import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/app/_components/ui/select'

import { IOption } from '~/app/_interfaces/common.interface'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form'

export function SelectFormField({
  name,
  options,
  label,
  placeholder,
  description,
  isOptionLabelMessageKey = false,
  disabled = false,
}: {
  name: string
  options: IOption[]
  label?: TMessageKey
  placeholder?: TMessageKey
  description?: TMessageKey
  isOptionLabelMessageKey?: boolean
  disabled?: boolean
}) {
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
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger ref={field.ref} disabled={disabled}>
                <SelectValue placeholder={placeholder && t(placeholder)} />
              </SelectTrigger>
              <SelectContent side='bottom'>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {isOptionLabelMessageKey
                      ? t(option.label as TMessageKey)
                      : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>{description && t(description)}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
