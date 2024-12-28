import { useQuery } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IAdminRes } from '~/shared/dto/admin/req'

import { fetcherAdmin } from '../../fetcher'

export function useGetMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => fetcherAdmin.get<IOkRes<IAdminRes>>('/me'),
    select: (data) => data.data,
  })
}
