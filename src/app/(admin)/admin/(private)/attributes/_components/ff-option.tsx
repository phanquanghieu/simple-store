import { useTranslations } from 'next-intl'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { LuArrowDownUp, LuPlus, LuX } from 'react-icons/lu'

import { E_ATTRIBUTE_TYPE } from '@prisma/client'
import { snakeCase } from 'lodash'

import { Button } from '~/app/_components/ui/button'
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '~/app/_components/ui/sortable'

import { useDeepCompareEffect, usePrevious } from '~/app/_hooks'

import { FFInput, FormItem, FormLabel } from '../../../_components/form'

type TFormValue = {
  type: E_ATTRIBUTE_TYPE
  options: { id?: string; name: string; key: string; value?: string }[]
}

export function FFOption({ label }: { label: TMessageKey }) {
  const type = useWatch<TFormValue, 'type'>({ name: 'type' })

  const t = useTranslations()
  return (
    <FormItem className='space-y-2'>
      <FormLabel>{t(label)}</FormLabel>
      {type === E_ATTRIBUTE_TYPE.TEXT && <FFTextOption />}
      {type === E_ATTRIBUTE_TYPE.COLOR && <FFColorOption />}
      {type === E_ATTRIBUTE_TYPE.BOOLEAN && <FFBooleanOption />}
    </FormItem>
  )
}

function FFTextOption() {
  const { control, trigger, setValue } = useFormContext<TFormValue>()

  const {
    fields: fieldOptions,
    remove,
    append,
    move,
  } = useFieldArray({
    control: control,
    keyName: '_id',
    name: 'options',
  })
  const watchOptions = useWatch<TFormValue, 'options'>({ name: 'options' })
  const options = fieldOptions.map((fieldOption, index) => ({
    ...fieldOption,
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
      value={options.map(({ _id }) => ({ id: _id }))}
    >
      {options.map((option, index) => (
        <SortableItem asChild key={option._id} value={option._id}>
          <div className='flex w-full gap-3 pb-1'>
            <div className='flex-none'>
              <SortableDragHandle>
                <LuArrowDownUp />
              </SortableDragHandle>
            </div>
            <div className='flex-1'>
              <FFInput
                name={`options.${index}.name`}
                placeholder={'Admin.Attribute.optionName'}
              />
            </div>
            <div className='flex-1'>
              <FFInput
                disabled={!!option.id}
                name={`options.${index}.key`}
                placeholder={'Admin.Attribute.optionKey'}
              />
            </div>
            <div className='flex-none'>
              <Button
                onClick={() => remove(index)}
                disabled={options.length === 1}
                size={'icon'}
                variant={'outline-destructive'}
              >
                <LuX />
              </Button>
            </div>
          </div>
        </SortableItem>
      ))}
      <Button
        onClick={() => append({ name: '', key: '' })}
        className='pl-2'
        size={'sm'}
        variant={'outline'}
      >
        <LuPlus />
        {t('Admin.Attribute.addOption')}
      </Button>
    </Sortable>
  )
}

function FFColorOption() {
  const { control, trigger, setValue } = useFormContext<TFormValue>()

  const {
    fields: fieldOptions,
    remove,
    append,
    move,
  } = useFieldArray({
    control: control,
    keyName: '_id',
    name: 'options',
  })
  const watchOptions = useWatch<TFormValue, 'options'>({ name: 'options' })
  const options = fieldOptions.map((fieldOption, index) => ({
    ...fieldOption,
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
      value={options.map(({ _id }) => ({ id: _id }))}
    >
      {options.map((option, index) => (
        <SortableItem asChild key={option._id} value={option._id}>
          <div className='flex w-full gap-3 pb-1'>
            <div className='flex-none'>
              <SortableDragHandle>
                <LuArrowDownUp />
              </SortableDragHandle>
            </div>
            <div className='flex-1'>
              <FFInput
                name={`options.${index}.name`}
                placeholder={'Admin.Attribute.optionName'}
              />
            </div>
            <div className='flex-1'>
              <FFInput
                disabled={!!option.id}
                name={`options.${index}.key`}
                placeholder={'Admin.Attribute.optionKey'}
              />
            </div>
            <div className='flex-1'>
              <FFInput name={`options.${index}.value`} type='color' />
            </div>
            <div className='flex-none'>
              <Button
                onClick={() => remove(index)}
                disabled={options.length === 1}
                size={'icon'}
                variant={'outline-destructive'}
              >
                <LuX />
              </Button>
            </div>
          </div>
        </SortableItem>
      ))}
      <Button
        onClick={() => append({ name: '', key: '', value: '' })}
        className='pl-2'
        size={'sm'}
        variant={'outline'}
      >
        <LuPlus />
        {t('Admin.Attribute.addOption')}
      </Button>
    </Sortable>
  )
}

function FFBooleanOption() {
  const { fields: fieldOptions, move } = useFieldArray<
    TFormValue,
    'options',
    '_id'
  >({
    keyName: '_id',
    name: 'options',
  })

  return (
    <Sortable
      onMove={({ activeIndex, overIndex }) => move(activeIndex, overIndex)}
      value={fieldOptions.map(({ _id }) => ({ id: _id }))}
    >
      {fieldOptions.map((option, index) => (
        <SortableItem asChild key={option._id} value={option._id}>
          <div className='flex w-full gap-3 pb-1'>
            <div className='flex-none'>
              <SortableDragHandle>
                <LuArrowDownUp />
              </SortableDragHandle>
            </div>
            <div className='flex-1'>
              <FFInput
                name={`options.${index}.name`}
                placeholder={'Admin.Attribute.optionName'}
              />
            </div>
            <div className='flex-1'>
              <FFInput
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
