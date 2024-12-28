import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { IOkListRes } from '~/shared/dto/_common/res'
import { IProductQuery } from '~/shared/dto/product/req'
import { IProductRes } from '~/shared/dto/product/res'

import { useQueryList } from '~/app/_hooks/query/use-query-list'

import { fetcherAdmin } from '../../fetcher'

export function useGetProducts(q: IProductQuery) {
  const [queryList] = useQueryList(q.sort)
  const query = { ...q, ...queryList }
  return useQuery({
    queryKey: ['products', query],
    queryFn: () =>
      fetcherAdmin.get<IOkListRes<IProductRes>>('/products', { query }),
    placeholderData: keepPreviousData,
  })
}
