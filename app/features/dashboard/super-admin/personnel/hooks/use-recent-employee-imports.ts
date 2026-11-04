import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { MeGet200 } from '~/shared/api/generated/model'
import { getMeGetQueryKey } from '~/shared/api/generated/operations/me/me-get'

interface RecentImport {
  id: string
  fileName: string
  createdAt: string
}
const limit = 20
function readRecent(key: string | null): RecentImport[] {
  if (!key) return []
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(key) ?? '[]')
    return Array.isArray(stored)
      ? stored
          .filter(
            (item): item is RecentImport =>
              typeof item?.id === 'string' && typeof item.fileName === 'string' && typeof item.createdAt === 'string'
          )
          .slice(0, limit)
      : []
  } catch {
    return []
  }
}

/** Navigation history only: the server still authorizes and reads each resumed import. */
export function useRecentEmployeeImports(current: RecentImport | null | undefined) {
  const client = useQueryClient()
  const appUserId = client.getQueryData<MeGet200>(getMeGetQueryKey())?.data?.appUserId
  const key = appUserId ? `saas-sentry.recent-employee-imports.${appUserId}` : null
  const recent = readRecent(key)
  const items = current ? [current, ...recent.filter((item) => item.id !== current.id)].slice(0, limit) : recent
  useEffect(() => {
    if (!key || !current) return
    const entries = [current, ...readRecent(key).filter((item) => item.id !== current.id)].slice(0, limit)
    try {
      sessionStorage.setItem(key, JSON.stringify(entries))
    } catch {
      /* Browsing remains available without storage. */
    }
  }, [key, current])
  return items
}
