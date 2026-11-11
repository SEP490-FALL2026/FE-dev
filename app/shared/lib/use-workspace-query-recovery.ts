import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { recordAdminRetryDelay, useAdminRetryDelay } from './use-retry-delay'

/** Query recovery shares the session's retry window with write forms. */
export function useWorkspaceQueryRecovery(query: { isError: boolean; error: unknown }, syncPermissions = true) {
  const client = useQueryClient()
  const retrySeconds = useAdminRetryDelay()
  useEffect(() => {
    if (!query.isError) return
    recordAdminRetryDelay(client, query.error)
    if (
      syncPermissions &&
      axios.isAxiosError(query.error) &&
      query.error.response?.data?.error?.code === 'AUTHORIZATION.FORBIDDEN'
    ) {
      void client
        .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
        .catch(() => undefined)
    }
  }, [client, query.isError, query.error, syncPermissions])
  return retrySeconds
}
