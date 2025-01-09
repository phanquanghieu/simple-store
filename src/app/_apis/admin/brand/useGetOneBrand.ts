import { useQuery } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IBrandRes } from '~/shared/dto/brand/res'

import { fetcherAdmin } from '../../fetcher'

export function useGetOneBrand(id: string) {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: () => fetcherAdmin.get<IOkRes<IBrandRes>>(`/brands/${id}`),
    select: (data) => data.data,
  })
}
