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
import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useDeleteBrand } from '~/app/_apis/admin/brand/useDeleteBrand'
import { useGetDetailBrand } from '~/app/_apis/admin/brand/useGetDetailBrand'
import { useUpdateBrand } from '~/app/_apis/admin/brand/useUpdateBrand'

import { ConfirmDialog } from '../../../_components/dialogs/confirm-dialog'
import {
  FFInput,
  FFReadonlyDate,
  FFRichText,
  Form,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'

const UpdateBrandFormSchema = zod.object({
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().trim().max(5000),
  updatedAt: zod.string().optional(),
  createdAt: zod.string().optional(),
})

type TUpdateBrandFormValue = z.infer<typeof UpdateBrandFormSchema>
const defaultValues: TUpdateBrandFormValue = {
  name: '',
  description: '',
}

export default function Page() {
  const { id } = useParams<TIdParam>()

  const { data: brand } = useGetDetailBrand(id)

  const { mutate: mutateUpdate, isPending: isUpdatePending } = useUpdateBrand()
  const { mutate: mutateDelete, isPending: isDeletePending } = useDeleteBrand()

  const [openDeleteDialog, toggleOpenDeleteDialog] = useToggle(false)

  const form = useForm<TUpdateBrandFormValue>({
    resolver: zodResolver(UpdateBrandFormSchema),
    values: brand && {
      name: brand?.name,
      description: brand?.description,
      updatedAt: brand?.updatedAt,
      createdAt: brand?.createdAt,
    },
    defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  const handleUpdate = (values: TUpdateBrandFormValue) => {
    mutateUpdate(
      {
        id,
        body: {
          name: values.name,
          description: values.description,
        },
      },
      {
        onSuccess: () => {
          router.push('/admin/brands')
        },
      },
    )
  }

  const handleDelete = () => {
    mutateDelete(id, {
      onSuccess: () => {
        router.push('/admin/brands')
      },
    })
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader backUrl='/admin/brands' title={t('Admin.Brand.editBrand')}>
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
          <Grid grid={4}>
            <Col col={2} start={2}>
              <CardS>
                <Grid className='gap-3'>
                  <FFInput autoFocus label={'Admin.Brand.name'} name='name' />
                  <FFRichText
                    label={'Admin.Brand.description'}
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
        title={t('Admin.Brand.RowAction.Confirm.DELETE')}
      />
    </>
  )
}
