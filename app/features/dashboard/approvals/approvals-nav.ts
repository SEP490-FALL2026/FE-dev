import { BarChart3, Clock, Grid2X2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ApprovalTabKey = 'overview' | 'queue' | 'expense-approval' | 'renewal-decision' | 'reports'

export type ApprovalTranslationKey = 'overview' | 'queue' | 'reports'

export interface ApprovalNavItem {
  badge?: number
  icon: LucideIcon
  key: ApprovalTabKey
  translationKey: ApprovalTranslationKey
}

export const approvalNavItems: ApprovalNavItem[] = [
  {
    icon: Grid2X2,
    key: 'overview',
    translationKey: 'overview'
  },
  {
    badge: 4,
    icon: Clock,
    key: 'queue',
    translationKey: 'queue'
  },
  {
    icon: BarChart3,
    key: 'reports',
    translationKey: 'reports'
  }
]

const validTabs = new Set<string>(['overview', 'queue', 'expense-approval', 'renewal-decision', 'reports'])

export function isValidApprovalTab(value: string | null): value is ApprovalTabKey {
  return value !== null && validTabs.has(value)
}

export function getParentApprovalMenuKey(tab: ApprovalTabKey): ApprovalTabKey {
  if (tab === 'expense-approval' || tab === 'renewal-decision') {
    return 'queue'
  }
  return tab
}
