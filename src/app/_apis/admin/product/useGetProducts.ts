import { useQuery } from '@tanstack/react-query'

import { IOkListRes } from '~/shared/dto/_common/res'
import { IGetProductQuery } from '~/shared/dto/product/req'
import { IProductRes } from '~/shared/dto/product/res'

import { useQueryFilter } from '~/app/_hooks/query/use-query-filter'
import { useQueryList } from '~/app/_hooks/query/use-query-list'

import { IFilterDef } from '~/app/_interfaces/data-table'

import { fetcherAdmin } from '../../fetcher'

export const SORT_DEFAULTS = [['name', 'asc']]
export const FILTER_DEFS: IFilterDef<IGetProductQuery>[] = [
  {
    queryField: 'search',
    dataType: 'string',
  },
  {
    queryField: 'status',
    dataType: 'string[]',
  },
  {
    queryField: 'totalVariants',
    dataType: 'number',
  },
]

export function useGetProducts() {
  const [queryList] = useQueryList(SORT_DEFAULTS)
  const [queryFilter] = useQueryFilter(FILTER_DEFS)

  const query = { ...queryList, ...queryFilter }
  return useQuery({
    queryKey: ['products', query],
    queryFn: () =>
      fetcherAdmin.get<IOkListRes<IProductRes>>('/products', { query }),
    staleTime: 10_000,
  })
}
