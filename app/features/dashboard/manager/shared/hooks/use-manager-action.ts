import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import { getManagerError } from './manager-errors'

/** Shared UX for generated write operations; each caller owns its affected query keys. */
export function useManagerAction<Result, Variables = void>(options: {
  mutationFn: (variables: Variables) => Promise<Result>
  invalidate: readonly QueryKey[]
  onSuccess?: (result: Result) => void
}) {
  const client = useQueryClient()
  const { t: translate } = useTranslation('manager')
  const [retrySeconds, setRetrySeconds] = useState(0)
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
  useEffect(() => {
    if (!retrySeconds) return
    const timer = window.setTimeout(() => setRetrySeconds(retrySeconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [retrySeconds])
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
      setFields(failure.fields)
      if (failure.key === 'unknownOutcome') setUncertain(true)
      if (failure.key === 'rateLimit') setRetrySeconds(failure.retrySeconds)
      else await refresh()
      if (failure.key === 'forbidden')
        await client
          .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
          .catch(() => undefined)
      toast.error(translate(`errors.${failure.key}`), {
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
  return {
    ...action,
    mutate,
    fields,
    retrySeconds,
    uncertain,
    blocked: action.isPending || uncertain || retrySeconds > 0
  }
}
