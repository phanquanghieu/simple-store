import { useWatch } from 'react-hook-form'

import { Grid } from '~/app/_components/ui/layout'

import { FFCurrency, FFInput } from '../../../_components/form'
import { TCUProductFormValue } from '../_schema'
import { calcMargin, calcProfit } from '../_util'

export function FFPrice() {
  const [price, cost] = useWatch<TCUProductFormValue, ['price', 'cost']>({
    name: ['price', 'cost'],
  })

  return (
    <Grid className='gap-3'>
      <Grid grid={2}>
        <FFCurrency label={'Admin.Product.price'} name='price' />
        <FFCurrency
          label={'Admin.Product.compareAtPrice'}
          name='compareAtPrice'
        />
      </Grid>
      <Grid grid={3}>
        <FFCurrency label={'Admin.Product.cost'} name='cost' />
        <FFCurrency
          label={'Admin.Product.profit'}
          name={''}
          readOnly
          value={calcProfit(cost, price)}
        />
        <FFInput
          icon={<div className='flex w-4 justify-center'>%</div>}
          label={'Admin.Product.margin'}
          name=''
          readOnly
          value={calcMargin(cost, price)}
          variant={'icon'}
        />
      </Grid>
    </Grid>
  )
}
