'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { TIdParam } from '~/shared/dto/_common/req'
import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs/zod'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useGetOneBrand } from '~/app/_apis/admin/brand/useGetOneBrand'
import { useUpdateBrand } from '~/app/_apis/admin/brand/useUpdateBrand'

import { Form, InputFormField } from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'

const UpdateBrandFormSchema = zod.object({
  name: zod.string().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().max(5000),
})

type TUpdateBrandFormValue = z.infer<typeof UpdateBrandFormSchema>
const defaultValues: TUpdateBrandFormValue = {
  name: '',
  description: '',
}

export default function Page() {
  const { id } = useParams<TIdParam>()

  const { data: brand } = useGetOneBrand(id)

  const { mutate, isPending } = useUpdateBrand()

  const form = useForm<TUpdateBrandFormValue>({
    resolver: zodResolver(UpdateBrandFormSchema),
    values: brand && {
      name: brand?.name,
      description: brand?.description,
    },
    defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  function onSubmit(values: TUpdateBrandFormValue) {
    mutate(
      { id, body: values },
      {
        onSuccess: () => {
          router.push('/admin/brands')
        },
      },
    )
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader title={t('Admin.Brand.editBrand')} backUrl='/admin/brands'>
        <Button type='submit' form={formId} disabled={isPending}>
          {t('Common.update')}
        </Button>
      </PageHeader>

      <Container>
        <Form id={formId} form={form} onSubmit={form.handleSubmit(onSubmit)}>
          <Grid grid={4}>
            <Col col={2} start={2}>
              <Grid>
                <CardS>
                  <Grid className='gap-3'>
                    <InputFormField name='name' label={'Admin.Brand.name'} />
                    <InputFormField
                      name='description'
                      label={'Admin.Brand.description'}
                    />
                  </Grid>
                </CardS>
              </Grid>
            </Col>
          </Grid>
        </Form>
      </Container>
    </>
  )
}
