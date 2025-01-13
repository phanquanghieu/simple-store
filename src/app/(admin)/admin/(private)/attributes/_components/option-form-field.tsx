import { useTranslations } from 'next-intl'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { LuArrowDownUp, LuPlus, LuTrash } from 'react-icons/lu'

import { E_ATTRIBUTE_TYPE } from '@prisma/client'
import { snakeCase } from 'lodash'

import { Button } from '~/app/_components/ui/button'

import { useDeepCompareEffect } from '~/app/_hooks/common/use-deep-compare-effect'
import { usePrevious } from '~/app/_hooks/common/use-previous'

import { FormItem, FormLabel, InputFormField } from '../../../_components/form'

type TFormValue = {
  type: E_ATTRIBUTE_TYPE
  options: { id?: string; name: string; key: string; value?: string }[]
}

export function OptionFormField({ label }: { label: TMessageKey }) {
  const { type } = useWatch()

  const t = useTranslations()
  return (
    <FormItem className='space-y-2'>
      <FormLabel>{t(label)}</FormLabel>
      {type === E_ATTRIBUTE_TYPE.TEXT && <TextOptionFormField />}
      {type === E_ATTRIBUTE_TYPE.COLOR && <ColorOptionFormField />}
      {type === E_ATTRIBUTE_TYPE.BOOLEAN && <BooleanOptionFormField />}
    </FormItem>
  )
}

function TextOptionFormField() {
  const { control, watch, trigger, setValue } = useFormContext<TFormValue>()
  const { fields, remove, append } = useFieldArray({
    control: control,
    keyName: '_id',
    name: 'options',
  })

  const watchOptions = watch('options')
  const options = fields.map((field, index) => ({
    ...field,
    ...watchOptions[index],
  }))

  const prevOptions = usePrevious(options)

  useDeepCompareEffect(() => {
    options.forEach((option, index) => {
      const prevName = prevOptions[index]?.name
      if (prevName !== option.name) {
        setValue(`options.${index}.key`, snakeCase(option.name))
      }

      const prevKey = prevOptions[index]?.key
      if (prevKey !== option.key) {
        options.forEach((o, i) => {
          if (!o.id) {
            if (o.key === option.key || o.key === prevKey) {
              trigger(`options.${i}.key`)
            }
          }
        })
      }
    })
  }, [options])

  const t = useTranslations()
  return (
    <>
      {fields.map((field, index) => (
        <div key={field._id} className='flex w-full gap-3 pb-1'>
          <div className='flex-none'>
            <Button
              size={'icon'}
              variant={'outline'}
              className='text-muted-foreground'
              onClick={() => {}}
            >
              <LuArrowDownUp />
            </Button>
          </div>
          <div className='flex-1'>
            <InputFormField
              name={`options.${index}.name`}
              placeholder={'Admin.Attribute.optionName'}
            />
          </div>
          <div className='flex-1'>
            <InputFormField
              name={`options.${index}.key`}
              placeholder={'Admin.Attribute.optionKey'}
              disabled={!!field.id}
            />
          </div>
          <div className='flex-none'>
            <Button
              size={'icon'}
              variant={'outline'}
              className='border-destructive'
              disabled={options.length === 1}
              onClick={() => {
                remove(index)
              }}
            >
              <LuTrash className='text-destructive' />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type='button'
        variant={'outline'}
        size={'sm'}
        className='hover:text-info-hover border-info pl-2 font-normal text-info'
        onClick={() => {
          append({ name: '', key: '' })
        }}
      >
        <LuPlus />
        {t('Admin.Attribute.addOption')}
      </Button>
    </>
  )
}

function ColorOptionFormField() {
  const { control, watch, trigger, setValue } = useFormContext<TFormValue>()
  const { fields, remove, append } = useFieldArray({
    control: control,
    keyName: '_id',
    name: 'options',
  })

  const watchOptions = watch('options')
  const options = fields.map((field, index) => ({
    ...field,
    ...watchOptions[index],
  }))

  const prevOptions = usePrevious(options)

  useDeepCompareEffect(() => {
    options.forEach((option, index) => {
      const prevName = prevOptions[index]?.name
      if (prevName !== option.name) {
        setValue(`options.${index}.key`, snakeCase(option.name))
      }

      const prevKey = prevOptions[index]?.key
      if (prevKey !== option.key) {
        options.forEach((o, i) => {
          if (!o.id) {
            if (o.key === option.key || o.key === prevKey) {
              trigger(`options.${i}.key`)
            }
          }
        })
      }
    })
  }, [options])

  const t = useTranslations()
  return (
    <>
      {fields.map((field, index) => (
        <div key={field._id} className='flex w-full gap-3 pb-1'>
          <div className='flex-none'>
            <Button
              size={'icon'}
              variant={'outline'}
              className='text-muted-foreground'
              onClick={() => {}}
            >
              <LuArrowDownUp />
            </Button>
          </div>
          <div className='flex-1'>
            <InputFormField
              name={`options.${index}.name`}
              placeholder={'Admin.Attribute.optionName'}
            />
          </div>
          <div className='flex-1'>
            <InputFormField
              name={`options.${index}.key`}
              placeholder={'Admin.Attribute.optionKey'}
              disabled={!!field.id}
            />
          </div>
          <div className='flex-1'>
            <InputFormField type='color' name={`options.${index}.value`} />
          </div>
          <div className='flex-none'>
            <Button
              size={'icon'}
              variant={'outline'}
              className='border-destructive'
              disabled={options.length === 1}
              onClick={() => {
                remove(index)
              }}
            >
              <LuTrash className='text-destructive' />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type='button'
        variant={'outline'}
        size={'sm'}
        className='hover:text-info-hover border-info pl-2 font-normal text-info'
        onClick={() => {
          append({ name: '', key: '', value: '' })
        }}
      >
        <LuPlus />
        {t('Admin.Attribute.addOption')}
      </Button>
    </>
  )
}

function BooleanOptionFormField() {
  const { control } = useFormContext<TFormValue>()
  const { fields } = useFieldArray({
    control: control,
    keyName: '_id',
    name: 'options',
  })

  return (
    <>
      {fields.map((field, index) => (
        <div key={field._id} className='flex w-full gap-3 pb-1'>
          <div className='flex-none'>
            <Button
              size={'icon'}
              variant={'outline'}
              className='text-muted-foreground'
              onClick={() => {}}
            >
              <LuArrowDownUp />
            </Button>
          </div>
          <div className='flex-1'>
            <InputFormField
              name={`options.${index}.name`}
              placeholder={'Admin.Attribute.optionName'}
            />
          </div>
          <div className='flex-1'>
            <InputFormField
              name={`options.${index}.key`}
              placeholder={'Admin.Attribute.optionKey'}
              disabled
            />
          </div>
        </div>
      ))}
    </>
  )
}
