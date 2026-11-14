import {
  Boxes,
  ClipboardList,
  Files,
  Grid2X2,
  Landmark,
  Plus,
  RefreshCw,
  UsersRound,
  type LucideIcon
} from 'lucide-react'
import { MANAGER_TAB_KEYS, type ManagerTabKey } from './enums'
export { MANAGER_TAB_KEYS, type ManagerTabKey }

export type ManagerTranslationKey =
  | 'renewals'
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
  | 'renewals'
  | 'overview'
  | 'team'
  | 'personnel'
  | 'tools'
  | 'requests'
  | 'createGroupRequest'
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
  {
    icon: Plus,
    key: 'create-employee-request',
    translationKey: 'createEmployeeRequest',
    liveLabel: 'createGroupRequest'
  },
  { icon: Files, key: 'weekly-batch', translationKey: 'weeklyBatch', liveLabel: 'batch' },
  { icon: Landmark, key: 'annual-budget', translationKey: 'annualBudget', liveLabel: 'budget' },
  { icon: RefreshCw, key: 'subscription-renewals', translationKey: 'renewals', liveLabel: 'renewals' }
]
const validTabs = new Set<string>(MANAGER_TAB_KEYS)
export function isValidManagerTab(value: string | null): value is ManagerTabKey {
  return value !== null && validTabs.has(value)
}
export function getParentManagerMenuKey(tab: ManagerTabKey, from?: string | null): ManagerTabKey {
  if (tab === 'personal-request') return 'overview'
  if (tab === 'tool-detail' || tab === 'return-detail') return 'team-software'
  if (tab === 'personnel-notices') return 'my-team'
  if (tab === 'employee-detail') return from === 'access-review' ? 'access-review' : 'my-team'
  if (tab === 'request-approval') return 'team-requests'
  if (tab === 'create-employee-request') return 'create-employee-request'
  if (tab === 'ghost-seat-detail') return 'ghost-seat-review'
  if (tab === 'profile') return 'profile'
  return tab
}
