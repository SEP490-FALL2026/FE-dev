import {
  ArrowRightLeft,
  Boxes,
  ClipboardList,
  Files,
  Grid2X2,
  Handshake,
  Landmark,
  Plus,
  UsersRound,
  type LucideIcon
} from 'lucide-react'
import { MANAGER_TAB_KEYS, type ManagerTabKey } from './enums'
export { MANAGER_TAB_KEYS, type ManagerTabKey }

export type ManagerTranslationKey =
  | 'overview'
  | 'myTeam'
  | 'teamSoftware'
  | 'teamRequests'
  | 'myRequests'
  | 'ghostSeatReview'
  | 'accessReview'
  | 'createEmployeeRequest'
  | 'weeklyBatch'
  | 'annualBudget'
  | 'transfers'
  | 'notices'
  | 'handovers'
type LiveLabel =
  | 'overview'
  | 'team'
  | 'personnel'
  | 'tools'
  | 'requests'
  | 'create'
  | 'batch'
  | 'budget'
  | 'transfers'
  | 'notices'
  | 'handovers'
export interface ManagerNavItem {
  icon: LucideIcon
  key: ManagerTabKey
  translationKey: ManagerTranslationKey
  liveLabel: LiveLabel
}
export const managerNavItems: ManagerNavItem[] = [
  { icon: Grid2X2, key: 'overview', translationKey: 'overview', liveLabel: 'overview' },
  { icon: UsersRound, key: 'my-team', translationKey: 'myTeam', liveLabel: 'personnel' },
  { icon: Boxes, key: 'team-software', translationKey: 'teamSoftware', liveLabel: 'tools' },
  { icon: ClipboardList, key: 'team-requests', translationKey: 'teamRequests', liveLabel: 'requests' },
  { icon: Plus, key: 'create-employee-request', translationKey: 'createEmployeeRequest', liveLabel: 'create' },
  { icon: Files, key: 'weekly-batch', translationKey: 'weeklyBatch', liveLabel: 'batch' },
  { icon: Landmark, key: 'annual-budget', translationKey: 'annualBudget', liveLabel: 'budget' },
  { icon: ArrowRightLeft, key: 'transfer-reviews', translationKey: 'transfers', liveLabel: 'transfers' },
  { icon: Handshake, key: 'handovers', translationKey: 'handovers', liveLabel: 'handovers' }
]
const validTabs = new Set<string>(MANAGER_TAB_KEYS)
export function isValidManagerTab(value: string | null): value is ManagerTabKey {
  return value !== null && validTabs.has(value)
}
export function getParentManagerMenuKey(tab: ManagerTabKey, from?: string | null): ManagerTabKey {
  if (tab === 'personnel-notices') return 'my-team'
  if (tab === 'employee-detail') return from === 'access-review' ? 'access-review' : 'my-team'
  if (tab === 'request-approval') return 'team-requests'
  if (tab === 'ghost-seat-detail') return 'ghost-seat-review'
  return tab
}
