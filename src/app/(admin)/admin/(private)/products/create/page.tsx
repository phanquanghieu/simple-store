'use client'

import { useTranslations } from 'next-intl'
import { useId } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { E_PRODUCT_STATUS } from '@prisma/client'
import { z } from 'zod'

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

import { InputFormField } from '../../../_components/form'
import { Form } from '../../../_components/form/form'
import { CurrencyFormField } from '../../../_components/form/form-field/currency-form-field'
import { SelectFormField } from '../../../_components/form/form-field/select-form-field'
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

export default function Page() {
  const form = useForm<TCreateProductFormValue>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: '',
      compareAtPrice: '',
      status: E_PRODUCT_STATUS.ACTIVE,
    },
    mode: 'onBlur',
  })
  const formId = useId()

  function onSubmit(values: TCreateProductFormValue) {
    console.log(values)
  }

  console.log(form)
  const t = useTranslations()

  return (
    <>
      <PageHeader
        title={t('Admin.Product.createProduct')}
        backUrl='/admin/products'
      >
        <Button type='submit' form={formId}>
          {t('Common.save')}
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
