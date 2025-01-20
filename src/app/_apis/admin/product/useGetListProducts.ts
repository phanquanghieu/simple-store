import { useQuery } from '@tanstack/react-query'

import { IOkListRes } from '~/shared/dto/_common/res'
import { IGetProductQuery } from '~/shared/dto/product/req'
import { IProductRes } from '~/shared/dto/product/res'

import { IFilterDef } from '~/app/_components/data-table'

import { useQueryFilter, useQueryList } from '~/app/_hooks'

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
    queryField: 'brandIds',
    dataType: 'string[]',
  },
]

export function useGetListProducts() {
  const [queryList] = useQueryList(SORT_DEFAULTS)
  const [queryFilter] = useQueryFilter(FILTER_DEFS)
  const query = { ...queryList, ...queryFilter }

  return useQuery({
    queryKey: ['products', query],
    queryFn: () =>
      fetcherAdmin.get<IOkListRes<IProductRes>>('/products', { query }),
  })
}
