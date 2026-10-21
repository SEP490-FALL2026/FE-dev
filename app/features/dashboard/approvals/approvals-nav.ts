import { BarChart3, Clock, Grid2X2, Landmark, PiggyBank, ScrollText, ShieldQuestion } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * `request`, `renewal` and `charge` are the APV-02/APV-03 detail screens opened from the APV-01 queue (UF-15).
 * `optimization` (APV-04) lists Finance's cost optimization proposals and `annual-budget` (APV-05) the department
 * budgets Finance sends for the next fiscal year; an item opens with the `id` param.
 */
export const APPROVAL_TAB_KEYS = [
  'overview',
  'queue',
  'request',
  'renewal',
  'charge',
  'optimization',
  'annual-budget',
  'exception-approval',
  'decision-history',
  'reports'
] as const

export type ApprovalTabKey = (typeof APPROVAL_TAB_KEYS)[number]

export type ApprovalTranslationKey =
  'annualBudget' | 'decisionHistory' | 'exceptionApproval' | 'optimization' | 'overview' | 'queue' | 'reports'

export interface ApprovalNavItem {
  badge?: number
  icon: LucideIcon
  key: ApprovalTabKey
  screenCode?: string
  translationKey: ApprovalTranslationKey
}

export const approvalNavItems: ApprovalNavItem[] = [
  { icon: Grid2X2, key: 'overview', translationKey: 'overview' },
  { badge: 8, icon: Clock, key: 'queue', screenCode: 'APV-01', translationKey: 'queue' },
  { badge: 2, icon: PiggyBank, key: 'optimization', screenCode: 'APV-04', translationKey: 'optimization' },
  { badge: 1, icon: Landmark, key: 'annual-budget', screenCode: 'APV-05', translationKey: 'annualBudget' },
  {
    badge: 2,
    icon: ShieldQuestion,
    key: 'exception-approval',
    screenCode: 'APV-07',
    translationKey: 'exceptionApproval'
  },
  { icon: ScrollText, key: 'decision-history', screenCode: 'APV-06', translationKey: 'decisionHistory' },
  { icon: BarChart3, key: 'reports', translationKey: 'reports' }
]

export function isValidApprovalTab(value: string | null): value is ApprovalTabKey {
  return value !== null && (APPROVAL_TAB_KEYS as readonly string[]).includes(value)
}

export function getParentApprovalMenuKey(tab: ApprovalTabKey): ApprovalTabKey {
  return tab === 'request' || tab === 'renewal' || tab === 'charge' ? 'queue' : tab
}
