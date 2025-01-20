'use client'

import { useTranslations } from 'next-intl'
import * as React from 'react'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  UseFormReturn,
  useFormContext,
} from 'react-hook-form'

import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'

import { E_ZOD_ERROR_CODE } from '~/shared/libs'

import { Label } from '~/app/_components/ui/label'

import { cn } from '~/app/_libs/utils'

const Form = ({
  children,
  id,
  form,
  onSubmit,
}: React.PropsWithChildren<{
  id?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any, any, any>
  onSubmit: () => void
}>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} id={id}>
        {children}
      </form>
    </FormProvider>
  )
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-2', className)} ref={ref} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ children, className, ...props }, ref) => {
  const { formItemId } = useFormField()

  if (!children) {
    return null
  }
  return (
    <Label
      className={cn('font-normal text-muted-foreground', className)}
      htmlFor={formItemId}
      ref={ref}
      {...props}
    >
      {children}
    </Label>
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & { isError?: boolean }
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      id={formItemId}
      isError={!!error}
      ref={ref}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  if (!children) {
    return null
  }
  return (
    <p
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      id={formDescriptionId}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const t = useTranslations()

  let message = children

  if (error?.message) {
    const [errorCode, v1, v2] = error.message.split('#')

    if (errorCode in E_ZOD_ERROR_CODE) {
      message = t(`Admin.Common.FormError.${errorCode}` as TMessageKey, {
        v1,
        v2,
      })
    } else {
      message = t.has(error.message as TMessageKey)
        ? t(error.message as TMessageKey)
        : error.message
    }
  }

  if (!message) {
    return null
  }

  return (
    <p
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      id={formMessageId}
      ref={ref}
      {...props}
    >
      {message}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
