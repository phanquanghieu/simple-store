import { useQuery } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { ICategoryDetailRes } from '~/shared/dto/category/res'

import { fetcherAdmin } from '../../fetcher'

export function useGetDetailCategory(id: string) {
  return useQuery({
    queryKey: ['categories', 'detail', id],
    queryFn: () =>
      fetcherAdmin.get<IOkRes<ICategoryDetailRes>>(`/categories/${id}`),
    select: (data) => data.data,
  })
}
