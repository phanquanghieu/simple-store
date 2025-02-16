import { useQuery } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IProductDetailRes } from '~/shared/dto/product/res'

import { fetcherAdmin } from '../../fetcher'

export function useGetDetailProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () =>
      fetcherAdmin.get<IOkRes<IProductDetailRes>>(`/products/${id}`),
    select: (data) => {
      const product = data.data
      return {
        product,
        brandOption: product.brand
          ? {
              value: product.brand.id,
              label: product.brand.name,
            }
          : undefined,
        categoryOption: product.category
          ? {
              value: product.category.id,
              label: product.category.name,
            }
          : undefined,
      }
    },
  })
}
