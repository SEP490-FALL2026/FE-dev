import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

/** Technical mutation feedback for shared domain components. Callers own API operations and error copy. */
export function useApiWrite<Result, Variables>(options: {
  mutationFn: (variables: Variables) => Promise<Result>
  invalidate: readonly QueryKey[]
  errorMessage?: (code: string, error: unknown) => string | undefined
  onSuccess?: (result: Result) => void
  onError?: (code: string, error: unknown) => void
  successMessage?: string
}) {
  const client = useQueryClient()
  const { t } = useTranslation('common')
  const [seconds, setSeconds] = useState(0)
  const [uncertain, setUncertain] = useState(false)
  const [fields, setFields] = useState<string[]>([])
  const lock = useRef(false)
  useEffect(() => {
    if (!seconds) return
    const timer = window.setTimeout(() => setSeconds(seconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [seconds])
  const refresh = () => Promise.all(options.invalidate.map((queryKey) => client.invalidateQueries({ queryKey })))
  const mutation = useMutation({
    mutationFn: options.mutationFn,
    retry: false,
    onSuccess: async (result) => {
      setFields([])
      options.onSuccess?.(result)
      await refresh()
      toast.success(options.successMessage ?? t('selfService.saved'), { id: 'self-service-write' })
    },
    onError: async (error) => {
      const response = axios.isAxiosError(error) ? error.response : undefined
      const code: string = response?.data?.error?.code ?? ''
      const issues: { path?: unknown }[] = response?.data?.error?.details?.issues ?? []
      setFields(
        issues
          .map(({ path }) => (typeof path === 'string' ? path : Array.isArray(path) ? path.join('.') : ''))
          .filter(Boolean)
      )
      const unknown =
        (axios.isAxiosError(error) && (!response || response.status >= 500)) ||
        (error instanceof Error && error.message === 'API.WRITE_OUTCOME_UNKNOWN')
      if (unknown) setUncertain(true)
      if (response?.status === 429) {
        const delay = Number(response.headers['retry-after'] ?? response.data?.error?.details?.retryAfterSeconds ?? 60)
        setSeconds(Number.isFinite(delay) ? Math.max(1, Math.ceil(delay)) : 60)
      } else await refresh()
      toast.error(
        unknown ? t('selfService.uncertain') : (options.errorMessage?.(code, error) ?? t('selfService.failed')),
        {
          id: 'self-service-write'
        }
      )
      options.onError?.(code, error)
    }
  })
  return {
    ...mutation,
    seconds,
    uncertain,
    fields,
    blocked: mutation.isPending || seconds > 0 || uncertain,
    mutate: (variables: Variables) => {
      if (lock.current || seconds || uncertain) return
      lock.current = true
      mutation.mutate(variables, {
        onSettled: () => {
          lock.current = false
        }
      })
    }
  }
}
