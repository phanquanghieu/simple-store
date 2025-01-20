import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import {
  E_BULK_ATTRIBUTE_TYPE,
  IBulkAttributeBody,
} from '~/shared/dto/attribute/req'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useBulkAttributes() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (body: IBulkAttributeBody) =>
      fetcherAdmin.put<IOkRes<boolean>>('/attributes/bulk', { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['attributes'] })
    },
    onSuccess(data, variables) {
      toast({
        variant: 'success',
        title:
          variables.type === E_BULK_ATTRIBUTE_TYPE.DELETE
            ? 'Admin.Common.Api.Success.BULK_DELETE'
            : 'Admin.Common.Api.Success.BULK_UPDATE',
      })
    },
  })
}
