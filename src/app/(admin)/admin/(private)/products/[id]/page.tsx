'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useId } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { E_PRODUCT_STATUS } from '@prisma/client'
import { z } from 'zod'

import { TIdParam } from '~/shared/dto/_common/req'
import { E_ZOD_ERROR_CODE, zod } from '~/shared/libs/zod'

import { Button } from '~/app/_components/ui/button'
import { Card, CardS } from '~/app/_components/ui/card'
import { Input } from '~/app/_components/ui/input'
import { Label } from '~/app/_components/ui/label'
import { Col, Container, Grid } from '~/app/_components/ui/layout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/app/_components/ui/select'
import { Textarea } from '~/app/_components/ui/textarea'

import { useGetOneProduct } from '~/app/_apis/admin/product/useGetOneProduct'

import { InputFormField } from '../../../_components/form'
import { Form } from '../../../_components/form/form'
import { CurrencyFormField } from '../../../_components/form/form-field/currency-form-field'
import { SelectFormField } from '../../../_components/form/form-field/select-form-field'
import { PageHeader } from '../../../_components/page-header'

const UpdateProductFormSchema = zod.object({
  name: zod.string().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  slug: zod.string().min(1, E_ZOD_ERROR_CODE.REQUIRED).max(256),
  description: zod.string().max(5000),
  price: zod.string().min(1, E_ZOD_ERROR_CODE.REQUIRED),
  compareAtPrice: zod.string().nullable(),
  status: zod.nativeEnum(E_PRODUCT_STATUS),
})

type TUpdateProductFormValue = z.infer<typeof UpdateProductFormSchema>
const defaultValues: TUpdateProductFormValue = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compareAtPrice: '',
  status: E_PRODUCT_STATUS.ACTIVE,
}

export default function Page() {
  const { id } = useParams<TIdParam>()

  const { data: product } = useGetOneProduct(id)

  const form = useForm<TUpdateProductFormValue>({
    resolver: zodResolver(UpdateProductFormSchema),
    values: product && {
      name: product?.name,
      slug: product?.slug,
      description: product?.description,
      price: product?.price,
      compareAtPrice: product?.compareAtPrice,
      status: product?.status,
    },
    defaultValues,
    mode: 'onBlur',
  })
  const formId = useId()

  function onSubmit(values: TUpdateProductFormValue) {
    console.log(values)
  }

  console.log(form.getValues())
  const t = useTranslations()

  return (
    <>
      <PageHeader
        title={t('Admin.Product.editProduct')}
        backUrl='/admin/products'
      >
        <Button variant={'destructive'}>{t('Common.delete')}</Button>
        <Button type='submit' form={formId}>
          {t('Common.update')}
        </Button>
      </PageHeader>

      <Container>
        <Form {...form}>
          <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
            <Grid grid={3}>
              <Col col={2}>
                <Grid>
                  <CardS>
                    <Grid className='gap-3'>
                      <InputFormField
                        name='name'
                        label={'Admin.Product.name'}
                      />
                      <InputFormField
                        name='slug'
                        label={'Admin.Product.slug'}
                      />
                      <InputFormField
                        name='description'
                        label={'Admin.Product.description'}
                      />
                    </Grid>
                  </CardS>
                  <CardS title={t('Admin.Product.price')}>
                    <Grid grid={3}>
                      <CurrencyFormField
                        name='price'
                        label={'Admin.Product.price'}
                      />
                      <CurrencyFormField
                        name='compareAtPrice'
                        label={'Admin.Product.compareAtPrice'}
                      />
                    </Grid>
                  </CardS>
                  <Card className='p-4'>
                    <Label className='text-muted-foreground'>Title</Label>
                    <Input placeholder='title' isError />
                    <Label className='text-muted-foreground'>description</Label>
                    <Textarea placeholder='title' className='' />
                    <Label className='text-muted-foreground'>select</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent side='bottom'>
                        {[1, 3].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Card>
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
          </form>
        </Form>
      </Container>
    </>
  )
}
