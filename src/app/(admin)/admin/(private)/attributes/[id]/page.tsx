'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuSave, LuTrash } from 'react-icons/lu'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from 'usehooks-ts'

import { TIdParam } from '~/shared/dto/_common/req'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useDeleteAttribute } from '~/app/_apis/admin/attribute/useDeleteAttribute'
import { useGetDetailAttribute } from '~/app/_apis/admin/attribute/useGetDetailAttribute'
import { useUpdateAttribute } from '~/app/_apis/admin/attribute/useUpdateAttribute'

import { ConfirmDialog } from '../../../_components/dialogs/confirm-dialog'
import {
  FFInput,
  FFReadonlyDate,
  FFRichText,
  FFSelect2,
  Form,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'
import { TYPE_OPTIONS } from '../_common'
import { FFOption } from '../_components/ff-option'
import {
  TUpdateAttributeFormValue,
  UpdateAttributeFormSchema,
  defaultUpdateAttributeFormValue,
} from '../_schema'

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
      : defaultUpdateAttributeFormValue,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const handleUpdate = (values: TUpdateAttributeFormValue) => {
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
        <Form
          onSubmit={form.handleSubmit(handleUpdate)}
          form={form}
          id={formId}
        >
          <Grid grid={2}>
            <Col>
              <CardS>
                <Grid className='gap-3'>
                  <FFInput
                    autoFocus
                    label={'Admin.Attribute.name'}
                    name='name'
                  />
                  <FFInput disabled label={'Admin.Attribute.key'} name='key' />
                  <FFRichText
                    label={'Admin.Attribute.description'}
                    name='description'
                  />

                  <Grid grid={2}>
                    <FFReadonlyDate
                      label={'Common.updatedAt'}
                      name='updatedAt'
                    />
                    <FFReadonlyDate
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
                    <FFSelect2
                      disabled
                      isOptionLabelMessageKey
                      label={'Admin.Attribute.type'}
                      name='type'
                      options={TYPE_OPTIONS}
                    />
                  </Col>
                  <Col col={2}>
                    <FFOption />
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
