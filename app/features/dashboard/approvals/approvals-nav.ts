import { Clock, Grid2X2, Landmark } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** Detail tabs open by API identifier; an unknown tab falls back to the overview. */
import { APPROVAL_TAB_KEYS, type ApprovalTabKey } from './enums'
export { APPROVAL_TAB_KEYS, type ApprovalTabKey }

/** Label keys under `nav` in the `approvals` namespace. */
export type ApprovalTranslationKey = 'annualBudget' | 'overview' | 'queue'

export interface ApprovalNavItem {
  badge?: number
  icon: LucideIcon
  key: ApprovalTabKey
  screenCode?: string
  translationKey: ApprovalTranslationKey
}

export const approvalNavItems: ApprovalNavItem[] = [
  { icon: Grid2X2, key: 'overview', translationKey: 'overview' },
  { icon: Clock, key: 'queue', screenCode: 'APV-01', translationKey: 'queue' },
  { icon: Landmark, key: 'annual-budget', screenCode: 'APV-05', translationKey: 'annualBudget' }
]

export function isValidApprovalTab(value: string | null): value is ApprovalTabKey {
  return value !== null && (APPROVAL_TAB_KEYS as readonly string[]).includes(value)
}

export function getParentApprovalMenuKey(tab: ApprovalTabKey): ApprovalTabKey {
  if (tab === 'need') return 'overview'
  return tab === 'request' || tab === 'batch' ? 'queue' : tab
}
