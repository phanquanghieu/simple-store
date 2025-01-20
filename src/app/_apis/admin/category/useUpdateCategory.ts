import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { IUpdateCategoryBody } from '~/shared/dto/category/req'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateCategoryBody }) =>
      fetcherAdmin.patch<IOkRes<boolean>>(`/categories/${id}`, { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.UPDATE',
      })
    },
  })
}
