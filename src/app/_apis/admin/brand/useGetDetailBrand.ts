import { useQuery } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IBrandDetailRes } from '~/shared/dto/brand/res'

import { fetcherAdmin } from '../../fetcher'

export function useGetDetailBrand(id: string) {
  return useQuery({
    queryKey: ['brands', 'detail', id],
    queryFn: () => fetcherAdmin.get<IOkRes<IBrandDetailRes>>(`/brands/${id}`),
    select: (data) => data.data,
  })
}
