'use client'

import { PropsWithChildren } from 'react'

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  isServer,
  keepPreviousData,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { toast } from '~/app/_hooks/use-toast'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: 'always',
        staleTime: 60_000,
        placeholderData: keepPreviousData,
      },
      mutations: {
        onError(error) {
          toast({
            variant: 'destructive',
            title: error.message,
          })
        },
      },
    },
    queryCache: new QueryCache({
      onError(error) {
        toast({
          variant: 'destructive',
          title: error.message,
        })
      },
    }),
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function ReactQueryProvider({ children }: PropsWithChildren) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
