import { useQuery } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IProductRes } from '~/shared/dto/product/res'

import { fetcherAdmin } from '../../fetcher'

export function useGetOneProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetcherAdmin.get<IOkRes<IProductRes>>(`/products/${id}`),
    select: (data) => data.data,
  })
}
