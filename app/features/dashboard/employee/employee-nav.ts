import { CirclePlus, FileText, Laptop, LayoutDashboard, User, type LucideIcon } from 'lucide-react'

export const EMPLOYEE_TAB_KEYS = [
  'overview',
  'my-software',
  'software-detail',
  'my-requests',
  'request-detail',
  'create-request',
  'request-new-software',
  'temporary-renewal',
  'return-license',
  'review-request',
  'submission-success',
  'profile',
  'data-export',
  'data-usage'
] as const

export type EmployeeTabKey = (typeof EMPLOYEE_TAB_KEYS)[number]

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
  translationKey: 'overview' | 'mySoftware' | 'myRequests' | 'createRequest' | 'profile'
}

export const employeeMenuItems: readonly EmployeeMenuItem[] = [
  {
    directTabKey: 'overview',
    icon: LayoutDashboard,
    key: 'overview',
    translationKey: 'overview'
  },
  {
    badge: 6,
    directTabKey: 'my-software',
    icon: Laptop,
    key: 'my-software',
    translationKey: 'mySoftware'
  },
  {
    badge: 2,
    directTabKey: 'my-requests',
    icon: FileText,
    key: 'my-requests',
    translationKey: 'myRequests'
  },
  {
    directTabKey: 'create-request',
    icon: CirclePlus,
    key: 'create-request',
    translationKey: 'createRequest'
  },
  {
    directTabKey: 'profile',
    icon: User,
    key: 'profile',
    translationKey: 'profile'
  }
]

export function getParentEmployeeMenuKey(tabKey: EmployeeTabKey): string {
  if (tabKey === 'overview') return 'overview'
  if (tabKey === 'my-software' || tabKey === 'software-detail') return 'my-software'
  if (tabKey === 'my-requests' || tabKey === 'request-detail') return 'my-requests'
  if (
    tabKey === 'create-request' ||
    tabKey === 'request-new-software' ||
    tabKey === 'temporary-renewal' ||
    tabKey === 'return-license' ||
    tabKey === 'review-request' ||
    tabKey === 'submission-success'
  )
    return 'create-request'
  if (tabKey === 'profile' || tabKey === 'data-export' || tabKey === 'data-usage') return 'profile'
  return 'overview'
}
