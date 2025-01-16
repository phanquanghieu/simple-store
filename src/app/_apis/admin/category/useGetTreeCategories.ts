import { useQuery } from '@tanstack/react-query'

import { IOkLiteRes } from '~/shared/dto/_common/res'
import { ICategoryLiteTreeRes } from '~/shared/dto/category/res'

import { fetcherAdmin } from '../../fetcher'

export function useGetTreeCategories(enabled = true) {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: () =>
      fetcherAdmin.get<IOkLiteRes<ICategoryLiteTreeRes>>('/categories/tree'),
    select: (data) => data.data,
    enabled,
  })
}
