import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import type { MeResponseDtoDataPendingPolicyAcknowledgementsItem } from '~/shared/api/generated/model/me'
import { getMeGetQueryKey, useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { usePolicyAcknowledgementCreate } from '~/shared/api/generated/operations/policies/policy-acknowledgement-create'

export type PendingPolicy = MeResponseDtoDataPendingPolicyAcknowledgementsItem
export type AcknowledgementErrorKey = 'network' | 'forbidden' | 'notFound' | 'rateLimit' | 'generic'

/** The code BE answers with when the caller's role does not owe this policy: the work is already done. */
const NOT_REQUIRED = 'POLICY.ACKNOWLEDGEMENT_NOT_REQUIRED'

export function getAcknowledgementError(error: unknown): { key: AcknowledgementErrorKey; notRequired: boolean } {
  const response = isAxiosError(error) ? error.response : undefined
  const code = (response?.data as { error?: { code?: string } } | undefined)?.error?.code
  if (code === NOT_REQUIRED) return { key: 'generic', notRequired: true }
  if (response === undefined) return { key: 'network', notRequired: false }
  if (response.status === 403) return { key: 'forbidden', notRequired: false }
  if (response.status === 404) return { key: 'notFound', notRequired: false }
  if (response.status === 429) return { key: 'rateLimit', notRequired: false }
  return { key: 'generic', notRequired: false }
}

/** Policies the signed-in account still owes. While `meGet` is loading or has failed nothing is owed, so nothing blocks. */
export function usePendingPolicies(): PendingPolicy[] {
  const me = useMeGet()
  return me.data?.data?.pendingPolicyAcknowledgements ?? []
}

/** Acknowledges one policy and refreshes `meGet` until BE stops listing it. */
export function useAcknowledgePolicy() {
  const queryClient = useQueryClient()
  const [errorKey, setErrorKey] = useState<AcknowledgementErrorKey | null>(null)
  const refresh = () => queryClient.invalidateQueries({ queryKey: getMeGetQueryKey() })
  const mutation = usePolicyAcknowledgementCreate({
    mutation: {
      onSuccess: async () => {
        setErrorKey(null)
        await refresh()
      },
      onError: async (error: unknown) => {
        const { key, notRequired } = getAcknowledgementError(error)
        if (notRequired) {
          setErrorKey(null)
          await refresh()
          return
        }
        setErrorKey(key)
      }
    }
  })
  return {
    acknowledge: (code: string) => {
      setErrorKey(null)
      mutation.mutate({ code })
    },
    isPending: mutation.isPending,
    errorKey
  }
}
