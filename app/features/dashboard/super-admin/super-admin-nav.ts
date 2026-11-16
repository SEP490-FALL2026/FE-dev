import { Activity, BellRing, BookOpen, Building2, FileClock, Grid2X2, Settings, UserCheck, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const SUPER_ADMIN_TAB_KEYS = [
  'overview',
  'departments',
  'accounts',
  'personnel',
  'reminders',
  'policies',
  'ghost-seats',
  'settings',
  'operations',
  'audit-trail'
] as const

export type SuperAdminTabKey = (typeof SUPER_ADMIN_TAB_KEYS)[number]
export type SuperAdminSelectTab = (tab: SuperAdminTabKey, parameters?: Record<string, string>) => void

export interface SuperAdminNavItem {
  badge?: number
  badgeTone?: 'warning' | 'info' | 'neutral'
  icon: LucideIcon
  key: SuperAdminTabKey
  translationKey: SuperAdminTabKey
}

export const superAdminNavItems: SuperAdminNavItem[] = [
  {
    icon: Grid2X2,
    key: 'overview',
    translationKey: 'overview'
  },
  {
    icon: Building2,
    key: 'departments',
    translationKey: 'departments'
  },
  {
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
  },
  {
    icon: BookOpen,
    key: 'policies',
    translationKey: 'policies'
  },
  { icon: Activity, key: 'operations', translationKey: 'operations' },
  { icon: Activity, key: 'ghost-seats', translationKey: 'ghost-seats' },
  { icon: Settings, key: 'settings', translationKey: 'settings' },
  { icon: FileClock, key: 'audit-trail', translationKey: 'audit-trail' }
]

export function isValidSuperAdminTab(value: string | null): value is SuperAdminTabKey {
  return value !== null && (SUPER_ADMIN_TAB_KEYS as readonly string[]).includes(value as SuperAdminTabKey)
}
