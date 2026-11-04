import {
  CirclePlus,
  FileText,
  Laptop,
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
  ClipboardCheck,
  type LucideIcon
} from 'lucide-react'

import { EMPLOYEE_TAB_KEYS, type EmployeeTabKey } from './enums'
export { EMPLOYEE_TAB_KEYS, type EmployeeTabKey }

export function isValidEmployeeTab(value: unknown): value is EmployeeTabKey {
  return typeof value === 'string' && EMPLOYEE_TAB_KEYS.includes(value as EmployeeTabKey)
}

export type EmployeeSubMenuItem = {
  badge?: number | string
  icon: LucideIcon
  key: EmployeeTabKey
  translationKey: 'dataExport' | 'dataUsage'
}

export type EmployeeMenuItem = {
  badge?: number | string
  children?: readonly EmployeeSubMenuItem[]
  directTabKey?: EmployeeTabKey
  icon: LucideIcon
  key: string
  translationKey: 'overview' | 'mySoftware' | 'myRequests' | 'create' | 'privacy' | 'handovers' | 'issues'
}

export const employeeMenuItems: readonly EmployeeMenuItem[] = [
  {
    directTabKey: 'overview',
    icon: LayoutDashboard,
    key: 'overview',
    translationKey: 'overview'
  },
  {
    directTabKey: 'my-software',
    icon: Laptop,
    key: 'my-software',
    translationKey: 'mySoftware'
  },
  {
    directTabKey: 'my-requests',
    icon: FileText,
    key: 'my-requests',
    translationKey: 'myRequests'
  },
  {
    directTabKey: 'create-request',
    icon: CirclePlus,
    key: 'create-request',
    translationKey: 'create'
  },
  {
    directTabKey: 'privacy',
    icon: ShieldCheck,
    key: 'privacy',
    translationKey: 'privacy'
  },
  { directTabKey: 'handovers', icon: ClipboardCheck, key: 'handovers', translationKey: 'handovers' },
  { directTabKey: 'issues', icon: MessageSquare, key: 'issues', translationKey: 'issues' }
]

export function getParentEmployeeMenuKey(tabKey: EmployeeTabKey): string {
  if (tabKey === 'handovers') return tabKey
  if (tabKey === 'issues' || tabKey === 'issue-detail' || tabKey === 'report-issue') return 'issues'
  if (tabKey === 'return-detail') return 'my-software'
  if (tabKey === 'overview') return 'overview'
  if (tabKey === 'my-software' || tabKey === 'software-detail') return 'my-software'
  if (tabKey === 'my-requests' || tabKey === 'request-detail') return 'my-requests'
  if (
    tabKey === 'create-request' ||
    tabKey === 'request-new-software' ||
    tabKey === 'request-software-details' ||
    tabKey === 'temporary-renewal' ||
    tabKey === 'return-license' ||
    tabKey === 'review-request' ||
    tabKey === 'submission-success'
  )
    return 'create-request'
  if (tabKey === 'profile') return ''
  if (tabKey === 'privacy' || tabKey === 'data-export' || tabKey === 'data-usage') return 'privacy'
  return 'overview'
}
