import { useTranslations } from 'next-intl'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { LuArrowDownUp, LuPlus, LuTrash } from 'react-icons/lu'

import { E_ATTRIBUTE_TYPE } from '@prisma/client'
import { snakeCase } from 'lodash'

import { Button } from '~/app/_components/ui/button'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '~/app/_components/ui/sortable'

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
  const { fields, remove, append, move } = useFieldArray({
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
    <Sortable
      onMove={({ activeIndex, overIndex }) => move(activeIndex, overIndex)}
      value={fields.map(({ _id }) => ({ id: _id }))}
    >
      {fields.map((field, index) => (
        <SortableItem asChild key={field._id} value={field._id}>
          <div className='flex w-full gap-3 pb-1'>
            <div className='flex-none'>
              <SortableDragHandle
                className='text-muted-foreground hover:cursor-move'
                size={'icon'}
                type='button'
                variant={'outline'}
              >
                <LuArrowDownUp />
              </SortableDragHandle>
            </div>
            <div className='flex-1'>
              <InputFormField
                name={`options.${index}.name`}
                placeholder={'Admin.Attribute.optionName'}
              />
            </div>
            <div className='flex-1'>
              <InputFormField
                disabled={!!field.id}
                name={`options.${index}.key`}
                placeholder={'Admin.Attribute.optionKey'}
              />
            </div>
            <div className='flex-none'>
              <Button
                onClick={() => {
                  remove(index)
                }}
                className='border-destructive'
                disabled={options.length === 1}
                size={'icon'}
                variant={'outline'}
              >
                <LuTrash className='text-destructive' />
              </Button>
            </div>
          </div>
        </SortableItem>
      ))}
      <Button
        onClick={() => {
          append({ name: '', key: '' })
        }}
        className='hover:text-info-hover border-info pl-2 font-normal text-info'
        size={'sm'}
        type='button'
        variant={'outline'}
      >
        <LuPlus />
        {t('Admin.Attribute.addOption')}
      </Button>
    </Sortable>
  )
}

function ColorOptionFormField() {
  const { control, watch, trigger, setValue } = useFormContext<TFormValue>()
  const { fields, remove, append, move } = useFieldArray({
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
    <Sortable
      onMove={({ activeIndex, overIndex }) => move(activeIndex, overIndex)}
      value={fields.map(({ _id }) => ({ id: _id }))}
    >
      {fields.map((field, index) => (
        <SortableItem asChild key={field._id} value={field._id}>
          <div className='flex w-full gap-3 pb-1'>
            <div className='flex-none'>
              <SortableDragHandle
                className='text-muted-foreground hover:cursor-move'
                size={'icon'}
                type='button'
                variant={'outline'}
              >
                <LuArrowDownUp />
              </SortableDragHandle>
            </div>
            <div className='flex-1'>
              <InputFormField
                name={`options.${index}.name`}
                placeholder={'Admin.Attribute.optionName'}
              />
            </div>
            <div className='flex-1'>
              <InputFormField
                disabled={!!field.id}
                name={`options.${index}.key`}
                placeholder={'Admin.Attribute.optionKey'}
              />
            </div>
            <div className='flex-1'>
              <InputFormField name={`options.${index}.value`} type='color' />
            </div>
            <div className='flex-none'>
              <Button
                onClick={() => {
                  remove(index)
                }}
                className='border-destructive'
                disabled={options.length === 1}
                size={'icon'}
                variant={'outline'}
              >
                <LuTrash className='text-destructive' />
              </Button>
            </div>
          </div>
        </SortableItem>
      ))}
      <Button
        onClick={() => {
          append({ name: '', key: '', value: '' })
        }}
        className='hover:text-info-hover border-info pl-2 font-normal text-info'
        size={'sm'}
        type='button'
        variant={'outline'}
      >
        <LuPlus />
        {t('Admin.Attribute.addOption')}
      </Button>
    </Sortable>
  )
}

function BooleanOptionFormField() {
  const { control } = useFormContext<TFormValue>()
  const { fields, move } = useFieldArray({
    control: control,
    keyName: '_id',
    name: 'options',
  })

  return (
    <Sortable
      onMove={({ activeIndex, overIndex }) => move(activeIndex, overIndex)}
      value={fields.map(({ _id }) => ({ id: _id }))}
    >
      {fields.map((field, index) => (
        <SortableItem asChild key={field._id} value={field._id}>
          <div className='flex w-full gap-3 pb-1'>
            <div className='flex-none'>
              <SortableDragHandle
                className='text-muted-foreground hover:cursor-move'
                size={'icon'}
                type='button'
                variant={'outline'}
              >
                <LuArrowDownUp />
              </SortableDragHandle>
            </div>
            <div className='flex-1'>
              <InputFormField
                name={`options.${index}.name`}
                placeholder={'Admin.Attribute.optionName'}
              />
            </div>
            <div className='flex-1'>
              <InputFormField
                disabled
                name={`options.${index}.key`}
                placeholder={'Admin.Attribute.optionKey'}
              />
            </div>
          </div>
        </SortableItem>
      ))}
    </Sortable>
  )
}
