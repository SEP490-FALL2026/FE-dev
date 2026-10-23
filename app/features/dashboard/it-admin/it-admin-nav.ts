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

export const IT_ADMIN_TAB_KEYS = [
  'overview',
  'provisioning',
  'reconciliation',
  'usage-import',
  'device-collectors',
  'license-optimization',
  'shadow-it',
  'dept-catalog'
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
        screenCode: 'Cấp phát & Thu hồi',
        translationKey: 'provisioning'
      },
      {
        badge: 4,
        icon: Scale,
        key: 'reconciliation',
        screenCode: 'Kiểm tra sai lệch bản quyền',
        translationKey: 'reconciliation'
      },
      {
        badge: 3,
        icon: UploadCloud,
        key: 'usage-import',
        screenCode: 'Nhập hóa đơn & hợp đồng',
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
        screenCode: 'Dữ liệu sử dụng theo phòng',
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
        screenCode: 'Tối ưu bản quyền',
        translationKey: 'licenseOptimization'
      },
      {
        badge: 4,
        icon: ShieldAlert,
        key: 'shadow-it',
        screenCode: 'Phần mềm ngoài danh mục',
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

