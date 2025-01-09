import { useQuery } from '@tanstack/react-query'

import { IOkListRes } from '~/shared/dto/_common/res'
import { IGetBrandQuery } from '~/shared/dto/brand/req'
import { IBrandRes } from '~/shared/dto/brand/res'

import { IFilterDef } from '~/app/_components/data-table/data-table.interface'

import { useQueryFilter } from '~/app/_hooks/query/use-query-filter'
import { useQueryList } from '~/app/_hooks/query/use-query-list'

import { fetcherAdmin } from '../../fetcher'

export const SORT_DEFAULTS = [['name', 'asc']]
export const FILTER_DEFS: IFilterDef<IGetBrandQuery>[] = [
  {
    queryField: 'search',
    dataType: 'string',
  },
]

export function useGetBrands() {
  const [queryList] = useQueryList(SORT_DEFAULTS)
  const [queryFilter] = useQueryFilter(FILTER_DEFS)
  const query = { ...queryList, ...queryFilter }

  return useQuery({
    queryKey: ['brands', query],
    queryFn: () =>
      fetcherAdmin.get<IOkListRes<IBrandRes>>('/brands', { query }),
  })
}
