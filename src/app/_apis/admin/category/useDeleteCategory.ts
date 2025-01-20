import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'

import { useToast } from '~/app/_hooks'

import { fetcherAdmin } from '../../fetcher'

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) =>
      fetcherAdmin.delete<IOkRes<boolean>>(`/categories/${id}`),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.DELETE',
      })
    },
  })
}
