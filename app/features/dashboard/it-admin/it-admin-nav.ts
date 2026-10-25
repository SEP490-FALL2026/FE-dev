import {
  CalendarClock,
  Laptop,
  Layers,
  LayoutDashboard,
  PackageCheck,
  Scale,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  UserMinus,
  UsersRound,
  UserX,
  type LucideIcon
} from 'lucide-react'

import { IT_ADMIN_TAB_KEYS, type ItAdminTabKey } from './enums'
export { IT_ADMIN_TAB_KEYS, type ItAdminTabKey }

export function isValidItAdminTab(value: unknown): value is ItAdminTabKey {
  return typeof value === 'string' && IT_ADMIN_TAB_KEYS.includes(value as ItAdminTabKey)
}

export type ItAdminSubMenuItem = {
  badge?: number | string
  icon: LucideIcon
  key: ItAdminTabKey
  translationKey:
    | 'provisioning'
    | 'reconciliation'
    | 'usageImport'
    | 'deviceCollectors'
    | 'licenseOptimization'
    | 'shadowIt'
    | 'deptCatalog'
}

export type ItAdminMenuItem = {
  children?: readonly ItAdminSubMenuItem[]
  directTabKey?: ItAdminTabKey
  icon: LucideIcon
  key: string
  translationKey: 'overview' | 'licenses' | 'usageSources' | 'optimize' | 'deptCatalog'
}

export const itAdminMenuItems: readonly ItAdminMenuItem[] = [
  {
    directTabKey: 'overview',
    icon: LayoutDashboard,
    key: 'overview',
    translationKey: 'overview'
  },
  {
    children: [
      {
        badge: 8,
        icon: PackageCheck,
        key: 'provisioning',
        translationKey: 'provisioning'
      },
      {
        badge: 4,
        icon: Scale,
        key: 'reconciliation',
        translationKey: 'reconciliation'
      },
      {
        badge: 3,
        icon: UploadCloud,
        key: 'usage-import',
        translationKey: 'usageImport'
      }
    ],
    icon: PackageCheck,
    key: 'licenses',
    translationKey: 'licenses'
  },
  {
    children: [
      {
        badge: 3,
        icon: Laptop,
        key: 'device-collectors',
        translationKey: 'deviceCollectors'
      }
    ],
    icon: Laptop,
    key: 'usage-sources',
    translationKey: 'usageSources'
  },
  {
    children: [
      {
        badge: 4,
        icon: Sparkles,
        key: 'license-optimization',
        translationKey: 'licenseOptimization'
      },
      {
        badge: 4,
        icon: ShieldAlert,
        key: 'shadow-it',
        translationKey: 'shadowIt'
      }
    ],
    icon: Sparkles,
    key: 'optimize',
    translationKey: 'optimize'
  },
  {
    directTabKey: 'dept-catalog',
    icon: Layers,
    key: 'dept-catalog',
    translationKey: 'deptCatalog'
  }
]

export function getParentMenuKey(tabKey: ItAdminTabKey): string {
  if (tabKey === 'overview') return 'overview'
  if (tabKey === 'provisioning' || tabKey === 'reconciliation' || tabKey === 'usage-import') return 'licenses'
  if (tabKey === 'device-collectors') return 'usage-sources'
  if (tabKey === 'license-optimization' || tabKey === 'shadow-it') return 'optimize'
  if (tabKey === 'dept-catalog') return 'dept-catalog'
  return 'overview'
}
