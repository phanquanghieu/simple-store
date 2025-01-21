import { useQuery } from '@tanstack/react-query'

import { ILiteQuery } from '~/shared/dto/_common/req'
import { IOkLiteRes } from '~/shared/dto/_common/res'
import { ICategoryLiteRes } from '~/shared/dto/category/res'

import { IOption } from '~/app/_interfaces/common.interface'

import { fetcherAdmin } from '../../fetcher'

export function useGetLiteCategories(
  query: Partial<ILiteQuery> = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ['categories', 'lite', query],
    queryFn: () =>
      fetcherAdmin.get<IOkLiteRes<ICategoryLiteRes>>('/categories/lite', {
        query,
      }),
    select: (data) => ({
      ...data,
      options: data.data.map((d) => ({
        label: d.name,
        value: d.id,
      })) as IOption[],
    }),
    enabled,
  })
}
