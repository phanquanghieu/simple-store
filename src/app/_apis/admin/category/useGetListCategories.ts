import { useQuery } from '@tanstack/react-query'

import { IOkListRes } from '~/shared/dto/_common/res'
import { IGetCategoryQuery } from '~/shared/dto/category/req'
import { ICategoryRes } from '~/shared/dto/category/res'

import { IFilterDef } from '~/app/_components/data-table'

import { useQueryFilter, useQueryList } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export const SORT_DEFAULTS = [['createdAt', 'desc']]
export const FILTER_DEFS: IFilterDef<IGetCategoryQuery>[] = [
  {
    queryField: 'search',
    dataType: 'string',
  },
  {
    queryField: 'parentId',
    dataType: 'string[]',
  },
]

export function useGetListCategories() {
  const [queryList] = useQueryList(SORT_DEFAULTS)
  const [queryFilter] = useQueryFilter(FILTER_DEFS)
  const query = { ...queryList, ...queryFilter }

  return useQuery({
    queryKey: ['categories', 'list', query],
    queryFn: () =>
      fetcherAdmin.get<IOkListRes<ICategoryRes>>('/categories', { query }),
  })
}
