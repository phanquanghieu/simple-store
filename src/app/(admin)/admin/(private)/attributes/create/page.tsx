'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { E_ATTRIBUTE_TYPE } from '@prisma/client'
import { snakeCase } from 'lodash'
import { z } from 'zod'

import { E_ATTRIBUTE_EXCEPTION } from '~/shared/dto/attribute/res'
import { E_ZOD_ERROR_CODE, zod, zodRegex } from '~/shared/libs/zod'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useCreateAttribute } from '~/app/_apis/admin/attribute/useCreateAttribute'

import {
  Form,
  InputFormField,
  RichTextFormField,
  SelectFormField,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'
import { TYPE_OPTIONS } from '../_common'
import { OptionFormField } from '../_components/option-form-field'

const CreateAttributeFormSchemaBase = zod.object({
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  key: zod
    .string()
    .trim()
    .regex(zodRegex.KEY, E_ZOD_ERROR_CODE.KEY_INVALID)
    .min(1, E_ZOD_ERROR_CODE.REQUIRED)
    .max(100),
  description: zod.string().trim().max(5000),
})
const OptionNameSchema = zod
  .string()
  .trim()
  .min(1, E_ZOD_ERROR_CODE.REQUIRED)
  .max(256)
const OptionKeySchema = zod
  .string()
  .trim()
  .min(1, E_ZOD_ERROR_CODE.REQUIRED)
  .regex(zodRegex.KEY, E_ZOD_ERROR_CODE.KEY_INVALID)
  .max(100)
const OptionSuperRefine = (
  options: { name: string; key: string }[],
  ctx: z.RefinementCtx,
) => {
  options.forEach((option, index) => {
    const hasSameKey = options.some(
      (o, i) => i !== index && o.key === option.key,
    )
    if (hasSameKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index, 'key'],
        message: E_ZOD_ERROR_CODE.UNIQUE,
      })
    }
  })
}

const CreateAttributeFormSchema = zod.discriminatedUnion('type', [
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.TEXT),
      options: zod
        .array(
          zod.object({
            name: OptionNameSchema,
            key: OptionKeySchema,
          }),
        )
        .nonempty()
        .max(100)
        .superRefine(OptionSuperRefine),
    })
    .merge(CreateAttributeFormSchemaBase),
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.COLOR),
      options: zod
        .array(
          zod.object({
            name: OptionNameSchema,
            key: OptionKeySchema,
            value: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(7),
          }),
        )
        .nonempty()
        .max(100)
        .superRefine(OptionSuperRefine),
    })
    .merge(CreateAttributeFormSchemaBase),
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.BOOLEAN),
      options: zod.array(
        zod.object({
          name: OptionNameSchema,
          key: zod.enum(['true', 'false']),
        }),
      ),
    })
    .merge(CreateAttributeFormSchemaBase),
])

type TCreateAttributeFormValue = z.infer<typeof CreateAttributeFormSchema>
const defaultValues: TCreateAttributeFormValue = {
  name: '',
  key: '',
  description: '',
  type: E_ATTRIBUTE_TYPE.TEXT,
  options: [
    {
      name: '',
      key: '',
    },
  ],
}

export default function Page() {
  const { mutate: mutateCreate, isPending } = useCreateAttribute()

  const form = useForm<TCreateAttributeFormValue>({
    resolver: zodResolver(CreateAttributeFormSchema),
    defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const name = form.watch('name')
  useEffect(() => {
    if (!form.formState.dirtyFields.key) {
      form.setValue('key', snakeCase(name))
    }
  }, [name, form])

  const type = form.watch('type')
  useEffect(() => {
    const DEFAULT_OPTIONS_BY_TYPE = {
      TEXT: [{ name: '', key: '' }],
      COLOR: [{ name: '', key: '', value: '' }],
      BOOLEAN: [
        { name: 'True', key: 'true' },
        { name: 'False', key: 'false' },
      ],
    }
    form.resetField('options')
    form.setValue(
      'options',
      DEFAULT_OPTIONS_BY_TYPE[type] as TCreateAttributeFormValue['options'],
    )
  }, [type, form])

  function onSubmit(values: TCreateAttributeFormValue) {
    mutateCreate(values, {
      onSuccess: () => {
        router.push('/admin/attributes')
      },
      onError(error) {
        if (error.message in E_ATTRIBUTE_EXCEPTION) {
          form.setError('key', {
            message: `Admin.Attribute.ApiException.${error.message}`,
          })
        }
      },
    })
  }
  const t = useTranslations()

  return (
    <>
      <PageHeader
        backUrl='/admin/attributes'
        title={t('Admin.Attribute.createAttribute')}
      >
        <Button disabled={isPending} form={formId} type='submit'>
          {t('Common.create')}
        </Button>
      </PageHeader>

      <Container>
        <Form onSubmit={form.handleSubmit(onSubmit)} form={form} id={formId}>
          <Grid grid={2}>
            <Col>
              <CardS>
                <Grid className='gap-3'>
                  <InputFormField
                    autoFocus
                    label={'Admin.Attribute.name'}
                    name='name'
                  />
                  <InputFormField label={'Admin.Attribute.key'} name='key' />
                  <RichTextFormField
                    label={'Admin.Attribute.description'}
                    name='description'
                  />
                </Grid>
              </CardS>
            </Col>
            <Col>
              <CardS>
                <Grid className='gap-3' grid={2}>
                  <Col>
                    <SelectFormField
                      isOptionLabelMessageKey
                      label={'Admin.Attribute.type'}
                      name='type'
                      options={TYPE_OPTIONS}
                    />
                  </Col>
                  <Col col={2}>
                    <OptionFormField label={'Admin.Attribute.options'} />
                  </Col>
                </Grid>
              </CardS>
            </Col>
          </Grid>
        </Form>
      </Container>
    </>
  )
}
