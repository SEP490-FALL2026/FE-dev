import { useCallback, useEffect, useRef, useState } from 'react'
import { deviceEnrollmentCodeCreate } from '~/shared/api/generated/operations/device-credentials/device-enrollment-code-create'
import type { EnrollmentCodeResponseDtoData } from '~/shared/api/generated/model/device-credentials'

// Secret responses deliberately bypass TanStack Query and its mutation cache.
export function useEnrollmentCode(id: string, onSuccess: () => void, onError: (error: unknown) => void) {
  const [secret, setSecret] = useState<EnrollmentCodeResponseDtoData>(null)
  const [pending, setPending] = useState(false)
  const lifecycle = useRef({ request: null as AbortController | null, version: 0, mounted: true })
  const clear = useCallback(() => {
    lifecycle.current.version++
    lifecycle.current.request?.abort()
    setSecret(null)
  }, [])
  useEffect(() => {
    const current = lifecycle.current
    current.mounted = true
    const hidden = () => {
      if (document.visibilityState === 'hidden') clear()
    }
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      current.mounted = false
      current.version++
      current.request?.abort()
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', hidden)
    }
  }, [clear, id])
  useEffect(() => {
    if (!secret) return
    const timeout = window.setTimeout(
      clear,
      Math.max(0, Math.min(60000, new Date(secret.expiresAt).getTime() - Date.now()))
    )
    return () => window.clearTimeout(timeout)
  }, [secret, clear])
  const create = async () => {
    if (lifecycle.current.request) return
    const current = ++lifecycle.current.version
    const controller = new AbortController()
    lifecycle.current.request = controller
    setPending(true)
    setSecret(null)
    try {
      const response = await deviceEnrollmentCodeCreate(
        id,
        { collectorKind: 'AI_COLLECTOR' },
        undefined,
        controller.signal
      )
      if (lifecycle.current.version !== current) return
      setSecret(response.data)
      onSuccess()
    } catch (error) {
      if (lifecycle.current.version === current) onError(error)
    } finally {
      lifecycle.current.request = null
      if (lifecycle.current.mounted) setPending(false)
    }
  }
  return { secret, pending, create, clear }
}
