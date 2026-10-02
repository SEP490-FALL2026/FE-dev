import {
  Laptop,
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

export const IT_ADMIN_TAB_KEYS = [
  'overview',
  'provisioning',
  'reconciliation',
  'usage-import',
  'unmatched-identities',
  'device-collectors',
  'license-optimization',
  'shadow-it',
  'offboarding'
] as const

export type ItAdminTabKey = (typeof IT_ADMIN_TAB_KEYS)[number]

export function isValidItAdminTab(value: unknown): value is ItAdminTabKey {
  return typeof value === 'string' && IT_ADMIN_TAB_KEYS.includes(value as ItAdminTabKey)
}

export type ItAdminSubMenuItem = {
  badge?: number | string
  icon: LucideIcon
  key: ItAdminTabKey
  screenCode: string
  translationKey:
    | 'provisioning'
    | 'reconciliation'
    | 'usageImport'
    | 'unmatchedIdentities'
    | 'deviceCollectors'
    | 'licenseOptimization'
    | 'shadowIt'
    | 'offboarding'
}

export type ItAdminMenuItem = {
  children?: readonly ItAdminSubMenuItem[]
  directTabKey?: ItAdminTabKey
  icon: LucideIcon
  key: string
  translationKey: 'overview' | 'licenses' | 'usageSources' | 'optimize' | 'people'
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
        badge: 3,
        icon: PackageCheck,
        key: 'provisioning',
        screenCode: 'UF-08 · ITA-05',
        translationKey: 'provisioning'
      },
      {
        badge: 4,
        icon: Scale,
        key: 'reconciliation',
        screenCode: 'UF-14 · ITA-11',
        translationKey: 'reconciliation'
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
        icon: UploadCloud,
        key: 'usage-import',
        screenCode: 'UF-06 · ITA-08',
        translationKey: 'usageImport'
      },
      {
        badge: 146,
        icon: UserX,
        key: 'unmatched-identities',
        screenCode: 'UF-07 · ITA-09',
        translationKey: 'unmatchedIdentities'
      },
      {
        badge: 24,
        icon: Laptop,
        key: 'device-collectors',
        screenCode: 'UF-16 · ITA-16',
        translationKey: 'deviceCollectors'
      }
    ],
    icon: UploadCloud,
    key: 'usage-sources',
    translationKey: 'usageSources'
  },
  {
    children: [
      {
        badge: 38,
        icon: Sparkles,
        key: 'license-optimization',
        screenCode: 'UF-10 · ITA-10',
        translationKey: 'licenseOptimization'
      },
      {
        badge: 6,
        icon: ShieldAlert,
        key: 'shadow-it',
        screenCode: 'UF-12 · ITA-15',
        translationKey: 'shadowIt'
      }
    ],
    icon: Sparkles,
    key: 'optimize',
    translationKey: 'optimize'
  },
  {
    children: [
      {
        badge: 1,
        icon: UserMinus,
        key: 'offboarding',
        screenCode: 'UF-09 · ITA-12',
        translationKey: 'offboarding'
      }
    ],
    icon: UsersRound,
    key: 'people',
    translationKey: 'people'
  }
]

export function getParentMenuKey(tabKey: ItAdminTabKey): string {
  if (tabKey === 'overview') return 'overview'
  if (tabKey === 'provisioning' || tabKey === 'reconciliation') return 'licenses'
  if (tabKey === 'usage-import' || tabKey === 'unmatched-identities' || tabKey === 'device-collectors')
    return 'usage-sources'
  if (tabKey === 'license-optimization' || tabKey === 'shadow-it') return 'optimize'
  if (tabKey === 'offboarding') return 'people'
  return 'overview'
}
