import axios from 'axios'

export function getRetryDelaySeconds(error: unknown): number {
  if (!axios.isAxiosError(error)) return 0
  const details = error.response?.data?.error?.details?.retryAfterSeconds
  const header = error.response?.headers?.['retry-after'] ?? error.response?.headers?.['Retry-After']
  const value = Number(details ?? header)
  return Number.isFinite(value) && value > 0 ? Math.ceil(value) : 0
}
