import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'

import { useToast } from '~/app/_hooks/use-toast'

import { fetcherAdmin } from '../../fetcher'

export function useDeleteBrand() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: string) =>
      fetcherAdmin.delete<IOkRes<boolean>>(`/brands/${id}`),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['brands', 'list'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.DELETE',
      })
    },
  })
}
