import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { E_BULK_BRAND_TYPE, IBulkBrandBody } from '~/shared/dto/brand/req'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useBulkBrands() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (body: IBulkBrandBody) =>
      fetcherAdmin.put<IOkRes<boolean>>('/brands/bulk', { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onSuccess(data, variables) {
      toast({
        variant: 'success',
        title:
          variables.type === E_BULK_BRAND_TYPE.DELETE
            ? 'Admin.Common.Api.Success.BULK_DELETE'
            : 'Admin.Common.Api.Success.BULK_UPDATE',
      })
    },
  })
}
