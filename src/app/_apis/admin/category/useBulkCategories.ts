import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import {
  E_BULK_CATEGORY_TYPE,
  IBulkCategoryBody,
} from '~/shared/dto/category/req'

import { useToast } from '~/app/_hooks/use-toast'

import { fetcherAdmin } from '../../fetcher'

export function useBulkCategories() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (body: IBulkCategoryBody) =>
      fetcherAdmin.put<IOkRes<boolean>>('/categories/bulk', { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onSuccess(data, variables) {
      toast({
        variant: 'success',
        title:
          variables.type === E_BULK_CATEGORY_TYPE.DELETE
            ? 'Admin.Common.Api.Success.BULK_DELETE'
            : 'Admin.Common.Api.Success.BULK_UPDATE',
      })
    },
  })
}
