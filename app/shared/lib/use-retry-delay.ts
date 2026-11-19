import { useEffect, useState, useSyncExternalStore } from 'react'
import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import axios from 'axios'

type RetryWindow = { until: number; startedAt: number; listeners: Set<() => void> }
const retryWindows = new WeakMap<QueryClient, RetryWindow>()
function windowFor(client: QueryClient) {
  let retryWindow = retryWindows.get(client)
  if (!retryWindow) {
    retryWindow = { until: 0, startedAt: 0, listeners: new Set() }
    retryWindows.set(client, retryWindow)
  }
  return retryWindow
}

/** A global 429 applies to the client, so switching forms cannot bypass its retry window. */
export function recordAdminRetryDelay(client: QueryClient, error: unknown) {
  if (!axios.isAxiosError(error) || error.response?.status !== 429) return
  const value = error.response.headers['retry-after'] ?? error.response.data?.error?.details?.retryAfterSeconds
  const numeric = Number(value)
  const seconds = Number.isFinite(numeric) ? numeric : (Date.parse(String(value)) - Date.now()) / 1000
  if (!Number.isFinite(seconds) || seconds <= 0) return
  const retryWindow = windowFor(client)
  retryWindow.startedAt = Date.now()
  retryWindow.until = Math.max(retryWindow.until, retryWindow.startedAt + Math.ceil(seconds) * 1000)
  retryWindow.listeners.forEach((listener) => listener())
}

export function useAdminRetryDelay() {
  const client = useQueryClient()
  const retryWindow = windowFor(client)
  const until = useSyncExternalStore(
    (listener) => {
      retryWindow.listeners.add(listener)
      return () => {
        retryWindow.listeners.delete(listener)
      }
    },
    () => retryWindow.until,
    () => 0
  )
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (until <= Date.now()) return
    const timer = window.setInterval(() => {
      const currentTime = Date.now()
      setNow(currentTime)
      if (currentTime >= until) window.clearInterval(timer)
    }, 250)
    return () => window.clearInterval(timer)
  }, [until])
  return Math.max(0, Math.ceil((until - Math.max(now, retryWindow.startedAt)) / 1000))
}
