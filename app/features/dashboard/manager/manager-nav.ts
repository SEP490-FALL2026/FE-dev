import { Boxes, ClipboardList, FileCheck2, Grid2X2, Plus, Sparkles, UsersRound, type LucideIcon } from 'lucide-react'

export type ManagerTabKey =
  | 'overview'
  | 'my-team'
  | 'employee-detail'
  | 'team-software'
  | 'team-requests'
  | 'request-approval'
  | 'create-employee-request'
  | 'ghost-seat-review'
  | 'ghost-seat-detail'
  | 'access-review'

export type ManagerTranslationKey =
  'overview' | 'myTeam' | 'teamSoftware' | 'teamRequests' | 'ghostSeatReview' | 'accessReview' | 'createEmployeeRequest'

export interface ManagerNavItem {
  badge?: number
  icon: LucideIcon
  key: ManagerTabKey
  translationKey: ManagerTranslationKey
}

export const managerNavItems: ManagerNavItem[] = [
  {
    icon: Grid2X2,
    key: 'overview',
    translationKey: 'overview'
  },
  {
    icon: UsersRound,
    key: 'my-team',
    translationKey: 'myTeam'
  },
  {
    icon: Boxes,
    key: 'team-software',
    translationKey: 'teamSoftware'
  },
  {
    badge: 3,
    icon: ClipboardList,
    key: 'team-requests',
    translationKey: 'teamRequests'
  },
  {
    badge: 4,
    icon: Sparkles,
    key: 'ghost-seat-review',
    translationKey: 'ghostSeatReview'
  },
  {
    badge: 6,
    icon: FileCheck2,
    key: 'access-review',
    translationKey: 'accessReview'
  },
  {
    icon: Plus,
    key: 'create-employee-request',
    translationKey: 'createEmployeeRequest'
  }
]

const validTabs = new Set<string>([
  'overview',
  'my-team',
  'employee-detail',
  'team-software',
  'team-requests',
  'request-approval',
  'create-employee-request',
  'ghost-seat-review',
  'ghost-seat-detail',
  'access-review'
])

export function isValidManagerTab(value: string | null): value is ManagerTabKey {
  return value !== null && validTabs.has(value)
}

export function getParentManagerMenuKey(tab: ManagerTabKey): ManagerTabKey {
  if (tab === 'employee-detail') {
    return 'my-team'
  }
  if (tab === 'request-approval') {
    return 'team-requests'
  }
  if (tab === 'ghost-seat-detail') {
    return 'ghost-seat-review'
  }
  return tab
}
