import { BellRing, Building2, FileText, Grid2X2, RotateCcw, Settings, UserCheck, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const SUPER_ADMIN_TAB_KEYS = [
  'overview',
  'departments',
  'accounts',
  'personnel',
  'reminders',
  'settings',
  'transfer',
  'audit-trail'
] as const

export type SuperAdminTabKey = (typeof SUPER_ADMIN_TAB_KEYS)[number]

export interface SuperAdminNavItem {
  badge?: number
  badgeTone?: 'warning' | 'info' | 'neutral'
  icon: LucideIcon
  key: SuperAdminTabKey
  translationKey: 'overview' | 'departments' | 'accounts' | 'personnel' | 'reminders'
}

export const superAdminNavItems: SuperAdminNavItem[] = [
  {
    icon: Grid2X2,
    key: 'overview',
    translationKey: 'overview'
  },
  {
    badge: 2, // 2 phòng chưa có Manager
    badgeTone: 'warning',
    icon: Building2,
    key: 'departments',
    translationKey: 'departments'
  },
  {
    badge: 3, // 3 nhân sự chưa xếp phòng
    badgeTone: 'info',
    icon: Users,
    key: 'accounts',
    translationKey: 'accounts'
  },
  {
    icon: UserCheck,
    key: 'personnel',
    translationKey: 'personnel'
  },
  {
    icon: BellRing,
    key: 'reminders',
    translationKey: 'reminders'
  }
]

export function isValidSuperAdminTab(value: string | null): value is SuperAdminTabKey {
  return value !== null && (SUPER_ADMIN_TAB_KEYS as readonly string[]).includes(value as SuperAdminTabKey)
}
