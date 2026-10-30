import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

/** Lock synchronously before React Query publishes pending; respect server retry windows. */
export function useAccountWriteGuard() {
  const submitted = useRef(false)
  const [remaining, setRemaining] = useState(0)
  useEffect(() => {
    if (!remaining) return
    const timer = window.setTimeout(() => setRemaining((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [remaining])
  return {
    remaining,
    acquire: () => {
      if (submitted.current || remaining > 0) return false
      submitted.current = true
      return true
    },
    release: () => {
      submitted.current = false
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error) || error.response?.status !== 429) return
      const value = error.response.headers['retry-after'] ?? error.response.data?.error?.details?.retryAfterSeconds
      const numeric = Number(value)
      const seconds = Number.isFinite(numeric) ? numeric : (Date.parse(String(value)) - Date.now()) / 1000
      if (Number.isFinite(seconds) && seconds > 0) setRemaining(Math.ceil(seconds))
    }
  }
}
