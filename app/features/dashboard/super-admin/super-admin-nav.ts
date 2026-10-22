import {
  FileText,
  Grid2X2,
  Lock,
  RotateCcw,
  Settings,
  ShieldAlert,
  Users
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const SUPER_ADMIN_TAB_KEYS = [
  'overview',
  'accounts',
  'settings',
  'transfer',
  'audit-trail'
] as const

export type SuperAdminTabKey = (typeof SUPER_ADMIN_TAB_KEYS)[number]

export interface SuperAdminNavItem {
  badge?: number
  icon: LucideIcon
  key: SuperAdminTabKey
  screenCode: string
  title: string
  translationKey: string
}

export const superAdminNavItems: SuperAdminNavItem[] = [
  {
    icon: Grid2X2,
    key: 'overview',
    screenCode: 'ADM-20',
    title: 'Tổng quan quản trị',
    translationKey: 'overview'
  },
  {
    badge: 2,
    icon: Users,
    key: 'accounts',
    screenCode: 'ADM-21',
    title: 'Tài khoản & Phân quyền',
    translationKey: 'accounts'
  },
  {
    icon: Settings,
    key: 'settings',
    screenCode: 'ADM-02',
    title: 'Cấu hình & Người duyệt',
    translationKey: 'settings'
  },
  {
    icon: RotateCcw,
    key: 'transfer',
    screenCode: 'ADM-22',
    title: 'Chuyển giao vai trò',
    translationKey: 'transfer'
  },
  {
    icon: FileText,
    key: 'audit-trail',
    screenCode: 'WF-03',
    title: 'Nhật ký & Tác vụ nền',
    translationKey: 'auditTrail'
  }
]

export function isValidSuperAdminTab(value: string | null): value is SuperAdminTabKey {
  return value !== null && (SUPER_ADMIN_TAB_KEYS as readonly string[]).includes(value)
}
