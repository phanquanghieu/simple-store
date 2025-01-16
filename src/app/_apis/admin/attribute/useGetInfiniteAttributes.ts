import { useInfiniteQuery } from '@tanstack/react-query'

import { ILiteQuery } from '~/shared/dto/_common/req'
import { IOkLiteRes } from '~/shared/dto/_common/res'
import { IAttributeLiteRes } from '~/shared/dto/attribute/res'

import { fetcherAdmin } from '../../fetcher'

const SORT_DEFAULTS = [['name', 'asc']]
const SIZE = 10

export function useGetInfinityAttributes(
  query: Partial<ILiteQuery> = {},
  enabled: boolean = true,
) {
  return useInfiniteQuery({
    queryKey: ['attributes', 'infinite', query],
    queryFn: ({ pageParam, queryKey }) =>
      fetcherAdmin.get<IOkLiteRes<IAttributeLiteRes>>('/attributes/lite', {
        query: {
          ...(queryKey[2] as Partial<ILiteQuery>),
          sort: SORT_DEFAULTS,
          size: SIZE,
          page: pageParam,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) =>
      lastPage.data.length < SIZE ? null : lastPageParam + 1,
    select: (data) => data.pages.flatMap((page) => page.data),
    enabled,
  })
}
