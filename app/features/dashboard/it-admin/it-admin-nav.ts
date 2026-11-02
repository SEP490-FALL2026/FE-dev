import {
  CalendarClock,
  Laptop,
  Layers,
  LayoutDashboard,
  MessageSquare,
  PackageCheck,
  Scale,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  UserMinus,
  UserX,
  type LucideIcon
} from 'lucide-react'
import { IT_ADMIN_TAB_KEYS, type ItAdminTabKey } from './enums'
export { IT_ADMIN_TAB_KEYS, type ItAdminTabKey }
export function isValidItAdminTab(value: unknown): value is ItAdminTabKey {
  return typeof value === 'string' && IT_ADMIN_TAB_KEYS.some((key) => key === value)
}
export type ItAdminSubMenuItem = {
  icon: LucideIcon
  key: ItAdminTabKey
  translationKey:
    | 'provisioning'
    | 'reconciliation'
    | 'usageImport'
    | 'deviceCollectors'
    | 'licenseOptimization'
    | 'shadowIt'
    | 'offboarding'
    | 'saasIssues'
    | 'identities'
    | 'renewals'
}
export type ItAdminMenuItem = {
  children?: readonly ItAdminSubMenuItem[]
  directTabKey?: ItAdminTabKey
  icon: LucideIcon
  key: string
  translationKey: 'overview' | 'licenses' | 'usageSources' | 'optimize' | 'deptCatalog'
}
export const itAdminMenuItems: readonly ItAdminMenuItem[] = [
  { key: 'overview', directTabKey: 'overview', icon: LayoutDashboard, translationKey: 'overview' },
  {
    key: 'licenses',
    icon: PackageCheck,
    translationKey: 'licenses',
    children: [
      { key: 'provisioning', icon: PackageCheck, translationKey: 'provisioning' },
      { key: 'offboarding', icon: UserMinus, translationKey: 'offboarding' },
      { key: 'saas-issues', icon: MessageSquare, translationKey: 'saasIssues' },
      { key: 'reconciliation', icon: Scale, translationKey: 'reconciliation' },
      { key: 'renewals', icon: CalendarClock, translationKey: 'renewals' }
    ]
  },
  {
    key: 'usage-sources',
    icon: Laptop,
    translationKey: 'usageSources',
    children: [
      { key: 'usage-import', icon: UploadCloud, translationKey: 'usageImport' },
      { key: 'device-collectors', icon: Laptop, translationKey: 'deviceCollectors' },
      { key: 'identities', icon: UserX, translationKey: 'identities' }
    ]
  },
  {
    key: 'optimize',
    icon: Sparkles,
    translationKey: 'optimize',
    children: [
      { key: 'license-optimization', icon: Sparkles, translationKey: 'licenseOptimization' },
      { key: 'shadow-it', icon: ShieldAlert, translationKey: 'shadowIt' }
    ]
  },
  { key: 'dept-catalog', directTabKey: 'dept-catalog', icon: Layers, translationKey: 'deptCatalog' }
]
export function getParentMenuKey(tab: ItAdminTabKey): string {
  return (
    itAdminMenuItems.find((item) => item.directTabKey === tab || item.children?.some((child) => child.key === tab))
      ?.key ?? 'overview'
  )
}
