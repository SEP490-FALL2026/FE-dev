import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getEmployeeError } from './employee-errors'
import { requestContractErrorKey } from '~/entities/request/request-contract-errors'
import { getGroupLineFailures } from '~/entities/request/group-request-feedback'
import { recordAdminRetryDelay, useAdminRetryDelay } from '~/shared/lib/use-retry-delay'

/** Mutation feedback only; each slice owns its generated operations and invalidation scope. */
export function useEmployeeFeedback(queryKeys: readonly QueryKey[]) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('employee')
  const { t: flow } = useTranslation('requestFlow')
  const retrySeconds = useAdminRetryDelay()
  const [failure, setFailure] = useState<ReturnType<typeof getEmployeeError> | null>(null)
  const [groupFailures, setGroupFailures] = useState<ReturnType<typeof getGroupLineFailures>>([])
  const [unknownOutcome, setUnknownOutcome] = useState(false)
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const active = useRef(true)
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])
  const invalidate = () => Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  const handleError = async (error: unknown, writing: boolean) => {
    const failure = getEmployeeError(error)
    setFailure(failure)
    setGroupFailures(getGroupLineFailures(error))
    recordAdminRetryDelay(queryClient, error)
    const key = !writing && failure.key === 'unknownOutcome' ? 'unavailable' : failure.key
    setInvalidFields(failure.fields)
    if (key === 'unknownOutcome') setUnknownOutcome(true)
    if (key !== 'rateLimit' && writing) await invalidate()
    if (failure.status === 403)
      await queryClient
        .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
        .catch(() => undefined)
    const contractKey = requestContractErrorKey(error)
    toast.error(contractKey ? flow(contractKey) : translate(`errors.${key}`), {
      id: 'employee-write',
      description: failure.requestId ? translate('requestId', { id: failure.requestId }) : undefined
    })
  }
  return {
    isActive: () => active.current,
    markUnknownOutcome: () => {
      setUnknownOutcome(true)
      void invalidate()
      toast.error(translate('errors.unknownOutcome'), { id: 'employee-write' })
    },
    invalidFields,
    failure,
    groupFailures,
    clearValidation: () => {
      setInvalidFields([])
      setGroupFailures([])
      setFailure(null)
    },
    retrySeconds,
    unknownOutcome,
    blocked: retrySeconds > 0 || unknownOutcome,
    onReadError: (error: unknown) => handleError(error, false),
    onSuccess: async () => {
      setInvalidFields([])
      setGroupFailures([])
      setFailure(null)
      await invalidate()
      toast.success(translate('saved'), { id: 'employee-write' })
    },
    onError: (error: unknown) => handleError(error, true)
  }
}
