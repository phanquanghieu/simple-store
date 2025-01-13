'use client'

import { useTranslations } from 'next-intl'
import { useId } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { E_PRODUCT_STATUS } from '@prisma/client'
import { z } from 'zod'

import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs/zod'

import { Button } from '~/app/_components/ui/button'
import { CardS } from '~/app/_components/ui/card'
import { Col, Container, Grid } from '~/app/_components/ui/layout'

import {
  CurrencyFormField,
  Form,
  InputFormField,
  SelectFormField,
} from '../../../_components/form'
import { PageHeader } from '../../../_components/page-header'

const CreateProductFormSchema = zod.object({
  name: zod.string().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  slug: zod.string().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().max(5000),
  price: zod.string().min(1, E_ZOD_ERROR_CODE.REQUIRED),
  compareAtPrice: zod.string(),
  status: zod.enum([E_PRODUCT_STATUS.ACTIVE, E_PRODUCT_STATUS.DRAFT]),
})

type TCreateProductFormValue = z.infer<typeof CreateProductFormSchema>
const defaultValues: TCreateProductFormValue = {
  name: '',
  slug: '',
  description: '',
  price: '0',
  compareAtPrice: '',
  status: E_PRODUCT_STATUS.ACTIVE,
}

export default function Page() {
  const form = useForm<TCreateProductFormValue>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()

  function onSubmit(values: TCreateProductFormValue) {
    console.log(values)
  }

  console.log(form.getValues())
  const t = useTranslations()

  return (
    <>
      <PageHeader
        backUrl='/admin/products'
        title={t('Admin.Product.createProduct')}
      >
        <Button form={formId} type='submit'>
          {t('Common.save')}
        </Button>
      </PageHeader>

      <Container>
        <Form onSubmit={form.handleSubmit(onSubmit)} form={form} id={formId}>
          <Grid grid={3}>
            <Col col={2}>
              <Grid>
                <CardS>
                  <Grid className='gap-3'>
                    <InputFormField label={'Admin.Product.name'} name='name' />
                    <InputFormField label={'Admin.Product.slug'} name='slug' />
                    <InputFormField
                      label={'Admin.Product.description'}
                      name='description'
                    />
                  </Grid>
                </CardS>
                <CardS title={t('Admin.Product.price')}>
                  <Grid grid={3}>
                    <CurrencyFormField
                      label={'Admin.Product.price'}
                      name='price'
                    />
                    <CurrencyFormField
                      label={'Admin.Product.compareAtPrice'}
                      name='compareAtPrice'
                    />
                  </Grid>
                </CardS>
              </Grid>
            </Col>

            <Col>
              <Grid>
                <CardS title={t('Admin.Product.status')}>
                  <SelectFormField
                    name='status'
                    options={[
                      { label: 'Active', value: E_PRODUCT_STATUS.ACTIVE },
                      { label: 'Draft', value: E_PRODUCT_STATUS.DRAFT },
                    ]}
                  />
                </CardS>
              </Grid>
            </Col>
          </Grid>
        </Form>
      </Container>
    </>
  )
}
