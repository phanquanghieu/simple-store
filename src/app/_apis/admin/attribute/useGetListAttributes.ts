import { useQuery } from '@tanstack/react-query'

import { IOkListRes } from '~/shared/dto/_common/res'
import { IGetAttributeQuery } from '~/shared/dto/attribute/req'
import { IAttributeRes } from '~/shared/dto/attribute/res'

import { IFilterDef } from '~/app/_components/data-table'

import { useQueryFilter, useQueryList } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export const SORT_DEFAULTS = [['createdAt', 'desc']]
export const FILTER_DEFS: IFilterDef<IGetAttributeQuery>[] = [
  {
    queryField: 'search',
    dataType: 'string',
  },
  {
    queryField: 'type',
    dataType: 'string[]',
  },
]

export function useGetListAttributes() {
  const [queryList] = useQueryList(SORT_DEFAULTS)
  const [queryFilter] = useQueryFilter(FILTER_DEFS)
  const query = { ...queryList, ...queryFilter }

  return useQuery({
    queryKey: ['attributes', 'list', query],
    queryFn: () =>
      fetcherAdmin.get<IOkListRes<IAttributeRes>>('/attributes', { query }),
  })
}
