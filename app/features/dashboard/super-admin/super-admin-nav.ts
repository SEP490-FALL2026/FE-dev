import { Activity, BellRing, BookOpen, Building2, Grid2X2, UserCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const SUPER_ADMIN_TAB_KEYS = [
  'overview',
  'departments',
  'accounts',
  'personnel',
  'reminders',
  'policies',
  'operations'
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
  { icon: Activity, key: 'operations', translationKey: 'operations' }
]

export function isValidSuperAdminTab(value: string | null): value is SuperAdminTabKey {
  return value !== null && (SUPER_ADMIN_TAB_KEYS as readonly string[]).includes(value as SuperAdminTabKey)
}

// Keep old account bookmarks working within the unified personnel navigation.
export function getParentSuperAdminTab(tab: SuperAdminTabKey): SuperAdminTabKey {
  return tab === 'accounts' ? 'personnel' : tab
}
