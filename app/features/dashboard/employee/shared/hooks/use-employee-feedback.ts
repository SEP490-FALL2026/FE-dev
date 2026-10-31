import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getEmployeeError } from './employee-errors'

/** Mutation feedback only; each slice owns its generated operations and invalidation scope. */
export function useEmployeeFeedback(queryKeys: readonly QueryKey[]) {
  const queryClient = useQueryClient()
  const { t: translate } = useTranslation('employee')
  const [retrySeconds, setRetrySeconds] = useState(0)
  const [unknownOutcome, setUnknownOutcome] = useState(false)
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const active = useRef(true)
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])
  useEffect(() => {
    if (!retrySeconds) return
    const timer = window.setTimeout(() => setRetrySeconds(retrySeconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [retrySeconds])
  const invalidate = () => Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  const handleError = async (error: unknown, writing: boolean) => {
    const failure = getEmployeeError(error)
    const key = !writing && failure.key === 'unknownOutcome' ? 'unavailable' : failure.key
    setInvalidFields(failure.fields)
    if (key === 'unknownOutcome') setUnknownOutcome(true)
    if (key === 'rateLimit') setRetrySeconds(failure.retryAfter)
    else if (writing) await invalidate()
    if (key === 'forbidden')
      await queryClient
        .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
        .catch(() => undefined)
    toast.error(translate(`errors.${key}`), {
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
    retrySeconds,
    unknownOutcome,
    blocked: retrySeconds > 0 || unknownOutcome,
    onReadError: (error: unknown) => handleError(error, false),
    onSuccess: async () => {
      setInvalidFields([])
      await invalidate()
      toast.success(translate('saved'), { id: 'employee-write' })
    },
    onError: (error: unknown) => handleError(error, true)
  }
}
