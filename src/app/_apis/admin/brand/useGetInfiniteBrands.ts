import { useInfiniteQuery } from '@tanstack/react-query'
import { defaults } from 'lodash'

import { ILiteQuery } from '~/shared/dto/_common/req'
import { IOkLiteRes } from '~/shared/dto/_common/res'
import { IBrandLiteRes } from '~/shared/dto/brand/res'

import { IOption } from '~/app/_interfaces/common.interface'

import { fetcherAdmin } from '../../fetcher'

export function useGetInfiniteBrands(
  query: Partial<ILiteQuery> = {},
  enabled: boolean = true,
) {
  defaults(query, { size: 10 })
  return useInfiniteQuery({
    queryKey: ['brands', 'infinite', query],
    queryFn: ({ pageParam, queryKey }) =>
      fetcherAdmin.get<IOkLiteRes<IBrandLiteRes>>('/brands/lite', {
        query: {
          ...(queryKey[2] as Partial<ILiteQuery>),
          page: pageParam,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) =>
      lastPage.data.length < query.size! ? null : lastPageParam + 1,
    select: (data) => {
      const _data = data.pages.flatMap((page) => page.data)
      return {
        data: _data,
        options: _data.map((brand) => ({
          label: brand.name,
          value: brand.id,
        })) as IOption[],
      }
    },
    enabled,
  })
}
