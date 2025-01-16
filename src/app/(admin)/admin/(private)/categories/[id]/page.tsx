'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { LuSave, LuTrash } from 'react-icons/lu'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from 'usehooks-ts'
import { z } from 'zod'

import { TIdParam } from '~/shared/dto/_common/req'
import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs/zod'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useDeleteCategory } from '~/app/_apis/admin/category/useDeleteCategory'
import { useGetDetailCategory } from '~/app/_apis/admin/category/useGetDetailCategory'
import { useUpdateCategory } from '~/app/_apis/admin/category/useUpdateCategory'

import { ConfirmDialog } from '../../../_components/dialogs/confirm-dialog'
import {
  Form,
  InputFormField,
  RichTextFormField,
  SelectFormField,
} from '../../../_components/form'
import { ReadonlyDateFormField } from '../../../_components/form/form-field/readonly-date-form-field'
import { AttributeFormField } from '../../../_components/form/resource-form-field/attribute-form-field'
import { PageHeader } from '../../../_components/page-header'

const UpdateCategoryFormSchema = zod.object({
  parentId: zod.string(),
  attributeIds: zod.array(zod.string()),
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().trim().max(5000),
  updatedAt: zod.string().optional(),
  createdAt: zod.string().optional(),
})

type TUpdateCategoryFormValue = z.infer<typeof UpdateCategoryFormSchema>
const defaultValues: TUpdateCategoryFormValue = {
  parentId: '_null',
  attributeIds: [],
  name: '',
  description: '',
}

export default function Page() {
  const { id } = useParams<TIdParam>()

  const { data: category } = useGetDetailCategory(id)

  const { mutate: mutateUpdate, isPending: isUpdatePending } =
    useUpdateCategory()
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteCategory()

  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false)

  const form = useForm<TUpdateCategoryFormValue>({
    resolver: zodResolver(UpdateCategoryFormSchema),
    values: category
      ? {
          parentId: category.parentId ?? '_null',
          attributeIds: category.attributes.map((attribute) => attribute.id),
          name: category.name,
          description: category.description,
          updatedAt: category.updatedAt,
          createdAt: category.createdAt,
        }
      : defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const handleUpdate = (values: TUpdateCategoryFormValue) => {
    mutateUpdate(
      {
        id,
        body: {
          parentId: values.parentId === '_null' ? null : values.parentId,
          attributeIds: values.attributeIds,
          name: values.name,
          description: values.description,
        },
      },
      {
        onSuccess: () => {
          router.push('/admin/categories')
        },
      },
    )
  }

  const handleDelete = () => {
    mutateDelete(id, {
      onSuccess: () => {
        router.push('/admin/categories')
      },
    })
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader
        backUrl='/admin/categories'
        title={t('Admin.Category.editCategory')}
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
                  <InputFormField
                    autoFocus
                    label={'Admin.Category.name'}
                    name='name'
                    placeholder={'Admin.Category.name'}
                  />
                  <RichTextFormField
                    label={'Admin.Category.description'}
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
                <Grid className='gap-3'>
                  <SelectFormField
                    hasNullOption
                    label={'Admin.Category.parent'}
                    name='parentId'
                    options={[{ value: '1', label: '111' }]}
                  />
                  <AttributeFormField
                    defaultOptions={category?.attributes.map((attribute) => ({
                      value: attribute.id,
                      label: attribute.name,
                    }))}
                    label={'Admin.Attribute.attributes'}
                    name='attributeIds'
                  />
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
        title={t('Admin.Category.RowAction.Confirm.DELETE')}
      />
    </>
  )
}
