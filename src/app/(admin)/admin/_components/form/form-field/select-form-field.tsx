import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/app/_components/ui/select'

import { SPECIAL_OPTION } from '~/app/_constant/common.constant'
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
  hasOptionNull = false,
}: {
  name: string
  options: IOption[]
  label?: TMessageKey
  placeholder?: TMessageKey
  description?: TMessageKey
  isOptionLabelMessageKey?: boolean
  disabled?: boolean
  hasOptionNull?: boolean
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
                {hasOptionNull && (
                  <SelectItem
                    key={SPECIAL_OPTION.null.value}
                    value={SPECIAL_OPTION.null.value}
                  >
                    {t(SPECIAL_OPTION.null.label)}
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
