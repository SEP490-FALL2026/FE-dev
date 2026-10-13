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
        screenCode: 'Cấp phát AI',
        translationKey: 'provisioning'
      },
      {
        badge: 4,
        icon: Scale,
        key: 'reconciliation',
        screenCode: 'Đối soát chi phí',
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
        screenCode: 'Nhập dữ liệu dùng',
        translationKey: 'usageImport'
      },
      {
        badge: 146,
        icon: UserX,
        key: 'unmatched-identities',
        screenCode: 'Khớp danh tính AI',
        translationKey: 'unmatchedIdentities'
      },
      {
        badge: 24,
        icon: Laptop,
        key: 'device-collectors',
        screenCode: 'Giám sát thiết bị',
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
        screenCode: 'Tối ưu tài khoản AI',
        translationKey: 'licenseOptimization'
      },
      {
        badge: 6,
        icon: ShieldAlert,
        key: 'shadow-it',
        screenCode: 'AI chưa khai báo',
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
        screenCode: 'Thu hồi nghỉ việc',
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
