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
  hasNullOption = false,
}: {
  name: string
  options: IOption[]
  label?: TMessageKey
  placeholder?: TMessageKey
  description?: TMessageKey
  isOptionLabelMessageKey?: boolean
  disabled?: boolean
  hasNullOption?: boolean
}) {
  const { control, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(name, formState)

  const t = useTranslations()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label && t(label)}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger
                disabled={disabled}
                isError={!!error}
                ref={field.ref}
              >
                <SelectValue placeholder={placeholder && t(placeholder)} />
              </SelectTrigger>
              <SelectContent side='bottom'>
                {hasNullOption && (
                  <SelectItem key={NullOption.value} value={NullOption.value}>
                    {t(NullOption.label)}
                  </SelectItem>
                )}
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

const NullOption: IOption<TMessageKey, string> = {
  label: 'Admin.Common.null',
  value: '_null',
}
