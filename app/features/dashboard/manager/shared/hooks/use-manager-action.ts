import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getManagerError } from './manager-errors'
import { requestContractErrorKey } from '~/entities/request/request-contract-errors'
import { recordAdminRetryDelay, useAdminRetryDelay } from '~/shared/lib/use-retry-delay'

/** Shared UX for generated write operations; each caller owns its affected query keys. */
export function useManagerAction<Result, Variables = void>(options: {
  mutationFn: (variables: Variables) => Promise<Result>
  invalidate: readonly QueryKey[]
  onSuccess?: (result: Result) => void
}) {
  const client = useQueryClient()
  const { t: translate } = useTranslation('manager')
  const { t: flow } = useTranslation('requestFlow')
  const retrySeconds = useAdminRetryDelay()
  const [uncertain, setUncertain] = useState(false)
  const [fields, setFields] = useState<string[]>([])
  const active = useRef(true)
  const locked = useRef(false)
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])
  const refresh = () => Promise.all(options.invalidate.map((queryKey) => client.invalidateQueries({ queryKey })))
  const action = useMutation({
    mutationFn: options.mutationFn,
    retry: false,
    onSuccess: async (result) => {
      setFields([])
      await refresh()
      toast.success(translate('saved'), { id: 'manager-write' })
      if (active.current) options.onSuccess?.(result)
    },
    onError: async (error) => {
      const failure = getManagerError(error, true)
      recordAdminRetryDelay(client, error)
      setFields(failure.fields)
      if (failure.key === 'unknownOutcome') setUncertain(true)
      if (failure.key !== 'rateLimit') await refresh()
      if (failure.key === 'forbidden')
        await client
          .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
          .catch(() => undefined)
      const contractKey = requestContractErrorKey(error)
      toast.error(contractKey ? flow(contractKey) : translate(`errors.${failure.key}`), {
        id: 'manager-write',
        description: failure.requestId ? translate('requestId', { id: failure.requestId }) : undefined
      })
    }
  })
  const mutate: typeof action.mutate = (variables, callbacks) => {
    if (locked.current || uncertain || retrySeconds > 0) return
    locked.current = true
    action.mutate(variables, {
      ...callbacks,
      onSettled: (...args) => {
        locked.current = false
        callbacks?.onSettled?.(...args)
      }
    })
  }
  const reset = action.reset
  const clearValidation = useCallback(() => {
    setFields([])
    reset()
  }, [reset])
  return {
    ...action,
    mutate,
    fields,
    clearValidation,
    retrySeconds,
    uncertain,
    blocked: action.isPending || uncertain || retrySeconds > 0
  }
}
