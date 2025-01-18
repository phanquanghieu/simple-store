import { useQuery } from '@tanstack/react-query'

import { ILiteQuery } from '~/shared/dto/_common/req'
import { IOkLiteRes } from '~/shared/dto/_common/res'
import { IBrandLiteRes } from '~/shared/dto/brand/res'

import { IOption } from '~/app/_interfaces/common.interface'

import { fetcherAdmin } from '../../fetcher'

export function useGetLiteBrands(
  query: Partial<ILiteQuery> = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ['brands', 'lite', query],
    queryFn: () =>
      fetcherAdmin.get<IOkLiteRes<IBrandLiteRes>>('/brands/lite', { query }),
    select: (data) => ({
      ...data,
      options: data.data.map((brand) => ({
        label: brand.name,
        value: brand.id,
      })) as IOption[],
    }),
    enabled,
  })
}
