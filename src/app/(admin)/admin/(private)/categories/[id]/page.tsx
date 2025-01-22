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
import { E_CATEGORY_EXCEPTION } from '~/shared/dto/category/res'
import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useDeleteCategory } from '~/app/_apis/admin/category/useDeleteCategory'
import { useGetDetailCategory } from '~/app/_apis/admin/category/useGetDetailCategory'
import { useUpdateCategory } from '~/app/_apis/admin/category/useUpdateCategory'

import { ConfirmDialog } from '../../../_components/dialogs/confirm-dialog'
import {
  FFAttribute,
  FFCategory,
  FFInput,
  FFReadonlyDate,
  FFRichText,
  Form,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'

const UpdateCategoryFormSchema = zod.object({
  parentId: zod.string().nullable(),
  attributeIds: zod.array(zod.string()),
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().trim().max(5000),
  updatedAt: zod.string().optional(),
  createdAt: zod.string().optional(),
})

type TUpdateCategoryFormValue = z.infer<typeof UpdateCategoryFormSchema>
const defaultValues: TUpdateCategoryFormValue = {
  parentId: null,
  attributeIds: [],
  name: '',
  description: '',
}

export default function Page() {
  const { id } = useParams<TIdParam>()

  const { data } = useGetDetailCategory(id)

  const { mutate: mutateUpdate, isPending: isUpdatePending } =
    useUpdateCategory()
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteCategory()

  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false)

  const form = useForm<TUpdateCategoryFormValue>({
    resolver: zodResolver(UpdateCategoryFormSchema),
    values: data
      ? {
          parentId: data.category.parentId,
          attributeIds: data.attributeIds,
          name: data.category.name,
          description: data.category.description,
          updatedAt: data.category.updatedAt,
          createdAt: data.category.createdAt,
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
          parentId: values.parentId,
          attributeIds: values.attributeIds,
          name: values.name,
          description: values.description,
        },
      },
      {
        onSuccess: () => {
          router.push('/admin/categories')
        },
        onError(error) {
          if (error.message in E_CATEGORY_EXCEPTION) {
            form.setError('parentId', {
              message: `Admin.Category.ApiException.${error.message}`,
            })
          }
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
                  <FFInput
                    autoFocus
                    label={'Admin.Category.name'}
                    name='name'
                    placeholder={'Admin.Category.name'}
                  />
                  <FFRichText
                    label={'Admin.Category.description'}
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
                <Grid className='gap-3'>
                  <FFCategory
                    disableValue={data?.category.id}
                    initOption={data?.parentOption}
                    label={'Admin.Category.parent'}
                    name='parentId'
                  />
                  <FFAttribute
                    initOption={data?.attributeOptions}
                    isMultiSelect
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
