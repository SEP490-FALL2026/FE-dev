import { BarChart3, Clock, Grid2X2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** `request`, `renewal` and `charge` are the APV-02/APV-03 detail screens opened from the APV-01 queue (UF-15). */
export const APPROVAL_TAB_KEYS = ['overview', 'queue', 'request', 'renewal', 'charge', 'reports'] as const

export type ApprovalTabKey = (typeof APPROVAL_TAB_KEYS)[number]

export type ApprovalTranslationKey = 'overview' | 'queue' | 'reports'

export interface ApprovalNavItem {
  badge?: number
  icon: LucideIcon
  key: ApprovalTabKey
  screenCode?: string
  translationKey: ApprovalTranslationKey
}

export const approvalNavItems: ApprovalNavItem[] = [
  { icon: Grid2X2, key: 'overview', translationKey: 'overview' },
  { badge: 7, icon: Clock, key: 'queue', screenCode: 'APV-01', translationKey: 'queue' },
  { icon: BarChart3, key: 'reports', translationKey: 'reports' }
]

export function isValidApprovalTab(value: string | null): value is ApprovalTabKey {
  return value !== null && (APPROVAL_TAB_KEYS as readonly string[]).includes(value)
}

export function getParentApprovalMenuKey(tab: ApprovalTabKey): ApprovalTabKey {
  return tab === 'request' || tab === 'renewal' || tab === 'charge' ? 'queue' : tab
}
