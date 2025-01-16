import { useMutation, useQueryClient } from '@tanstack/react-query'

import { IOkRes } from '~/shared/dto/_common/res'
import { ICreateCategoryBody } from '~/shared/dto/category/req'

import { useToast } from '~/app/_hooks/use-toast'

import { fetcherAdmin } from '../../fetcher'

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (body: ICreateCategoryBody) =>
      fetcherAdmin.post<IOkRes<boolean>>('/categories', { body }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onSuccess() {
      toast({
        variant: 'success',
        title: 'Admin.Common.Api.Success.CREATE',
      })
    },
  })
}
