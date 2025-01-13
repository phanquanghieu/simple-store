'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuSave, LuTrash } from 'react-icons/lu'

import { zodResolver } from '@hookform/resolvers/zod'
import { E_ATTRIBUTE_TYPE } from '@prisma/client'
import { useToggle } from 'usehooks-ts'
import { z } from 'zod'

import { TIdParam } from '~/shared/dto/_common/req'
import { E_ZOD_ERROR_CODE, zod, zodRegex } from '~/shared/libs/zod'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useDeleteAttribute } from '~/app/_apis/admin/attribute/useDeleteAttribute'
import { useGetDetailAttribute } from '~/app/_apis/admin/attribute/useGetDetailAttribute'
import { useUpdateAttribute } from '~/app/_apis/admin/attribute/useUpdateAttribute'

import { ConfirmDialog } from '../../../_components/dialogs/confirm-dialog'
import {
  Form,
  InputFormField,
  RichTextFormField,
  SelectFormField,
} from '../../../_components/form'
import { ReadonlyDateFormField } from '../../../_components/form/form-field/readonly-date-form-field'
import { PageHeader } from '../../../_components/page-header'
import { TYPE_OPTIONS } from '../_common'
import { OptionFormField } from '../_components/option-form-field'

const UpdateAttributeFormSchemaBase = zod.object({
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  key: zod.string(),
  description: zod.string().trim().max(5000),
  updatedAt: zod.string().optional(),
  createdAt: zod.string().optional(),
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

const UpdateAttributeFormSchema = zod.discriminatedUnion('type', [
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.TEXT),
      options: zod
        .array(
          zod.object({
            id: zod.string().optional(),
            name: OptionNameSchema,
            key: OptionKeySchema,
          }),
        )
        .nonempty()
        .max(100)
        .superRefine(OptionSuperRefine),
    })
    .merge(UpdateAttributeFormSchemaBase),
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.COLOR),
      options: zod
        .array(
          zod.object({
            id: zod.string().optional(),
            name: OptionNameSchema,
            key: OptionKeySchema,
            value: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(7),
          }),
        )
        .nonempty()
        .max(100)
        .superRefine(OptionSuperRefine),
    })
    .merge(UpdateAttributeFormSchemaBase),
  zod
    .object({
      type: zod.literal(E_ATTRIBUTE_TYPE.BOOLEAN),
      options: zod.array(
        zod.object({
          id: zod.string().optional(),
          name: OptionNameSchema,
          key: zod.string(),
        }),
      ),
    })
    .merge(UpdateAttributeFormSchemaBase),
])

type TUpdateAttributeFormValue = z.infer<typeof UpdateAttributeFormSchema>
const defaultValues = {
  name: '',
  key: '',
  description: '',
} as TUpdateAttributeFormValue

export default function Page() {
  const { id } = useParams<TIdParam>()

  const { data: attribute } = useGetDetailAttribute(id)

  const { mutate: mutateUpdate, isPending: isUpdatePending } =
    useUpdateAttribute()
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteAttribute()

  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false)

  const form = useForm<TUpdateAttributeFormValue>({
    resolver: zodResolver(UpdateAttributeFormSchema),
    values: attribute
      ? ({
          name: attribute.name,
          description: attribute.description,
          key: attribute.key,
          type: attribute.type,
          options: attribute.options.map((option) => ({
            id: option.id,
            name: option.name,
            key: option.key,
            value: option.value,
          })),
          updatedAt: attribute.updatedAt,
          createdAt: attribute.createdAt,
        } as TUpdateAttributeFormValue)
      : defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const onSubmit = (values: TUpdateAttributeFormValue) => {
    mutateUpdate(
      { id, body: values },
      {
        onSuccess: () => {
          router.push('/admin/attributes')
        },
      },
    )
  }

  const handleDelete = () => {
    mutateDelete(id, {
      onSuccess: () => {
        router.push('/admin/attributes')
      },
    })
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader
        backUrl='/admin/attributes'
        title={t('Admin.Attribute.editAttribute')}
      >
        <Button
          onClick={toggleOpenDeleteDialog}
          disabled={isDeletePending}
          size={'sm-icon'}
          variant={'destructive'}
        >
          <LuTrash />
          {t('Common.delete')}
        </Button>
        <Button
          disabled={isUpdatePending}
          form={formId}
          size={'sm-icon'}
          type='submit'
        >
          <LuSave />
          {t('Common.update')}
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
                  <InputFormField
                    disabled
                    label={'Admin.Attribute.key'}
                    name='key'
                  />
                  <RichTextFormField
                    label={'Admin.Attribute.description'}
                    name='description'
                  />

                  <Grid grid={2}>
                    <ReadonlyDateFormField
                      label={'Common.updatedAt'}
                      name='updatedAt'
                    />
                    <ReadonlyDateFormField
                      label={'Common.createdAt'}
                      name='createdAt'
                    />
                  </Grid>
                </Grid>
              </CardS>
            </Col>
            <Col>
              <CardS>
                <Grid className='gap-3' grid={2}>
                  <Col>
                    <SelectFormField
                      disabled
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

      <ConfirmDialog
        onAction={handleDelete}
        onOpenChange={toggleOpenDeleteDialog}
        actionTitle={t('Common.delete')}
        actionVariant={'destructive'}
        isActionPending={isDeletePending}
        open={openDeleteDialog}
        title={t('Admin.Attribute.RowAction.Confirm.DELETE')}
      />
    </>
  )
}
