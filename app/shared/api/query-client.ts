import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const status = axios.isAxiosError(error) ? error.response?.status : undefined
          return failureCount < 1 && (status === undefined || status >= 500)
        },
        staleTime: 30_000
      },
      mutations: {
        retry: 0
      }
    }
  })
}
