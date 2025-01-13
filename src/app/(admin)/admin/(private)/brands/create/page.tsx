'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs/zod'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import { useCreateBrand } from '~/app/_apis/admin/brand/useCreateBrand'

import {
  Form,
  InputFormField,
  RichTextFormField,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'

const CreateBrandFormSchema = zod.object({
  name: zod.string().trim().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().trim().max(5000),
})

type TCreateBrandFormValue = z.infer<typeof CreateBrandFormSchema>
const defaultValues: TCreateBrandFormValue = {
  name: '',
  description: '',
}

export default function Page() {
  const { mutate, isPending } = useCreateBrand()

  const form = useForm<TCreateBrandFormValue>({
    resolver: zodResolver(CreateBrandFormSchema),
    defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()
  const router = useRouter()

  function onSubmit(values: TCreateBrandFormValue) {
    mutate(values, {
      onSuccess: () => {
        router.push('/admin/brands')
      },
    })
  }

  const t = useTranslations()

  return (
    <>
      <PageHeader backUrl='/admin/brands' title={t('Admin.Brand.createBrand')}>
        <Button disabled={isPending} form={formId} type='submit'>
          {t('Common.create')}
        </Button>
      </PageHeader>

      <Container>
        <Form onSubmit={form.handleSubmit(onSubmit)} form={form} id={formId}>
          <Grid grid={4}>
            <Col col={2} start={2}>
              <Grid>
                <CardS>
                  <Grid className='gap-3'>
                    <InputFormField
                      autoFocus
                      label={'Admin.Brand.name'}
                      name='name'
                    />
                    <RichTextFormField
                      label={'Admin.Brand.description'}
                      name='description'
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
