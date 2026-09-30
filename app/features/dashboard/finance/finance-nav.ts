import { Calendar, CreditCard, Grid2X2, Layers, PieChart, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type FinanceTabKey =
  'overview' | 'budget-snapshot' | 'renewal-schedule' | 'held-commitments' | 'shadow-it' | 'software-directory'

export type FinanceTranslationKey =
  'overview' | 'budgetSnapshot' | 'renewalSchedule' | 'heldCommitments' | 'shadowIt' | 'softwareDirectory'

export interface FinanceNavItem {
  badge?: number
  icon: LucideIcon
  key: FinanceTabKey
  translationKey: FinanceTranslationKey
}

export const financeNavItems: FinanceNavItem[] = [
  {
    icon: Grid2X2,
    key: 'overview',
    translationKey: 'overview'
  },
  {
    icon: PieChart,
    key: 'budget-snapshot',
    translationKey: 'budgetSnapshot'
  },
  {
    badge: 3,
    icon: Calendar,
    key: 'renewal-schedule',
    translationKey: 'renewalSchedule'
  },
  {
    icon: Wallet,
    key: 'held-commitments',
    translationKey: 'heldCommitments'
  },
  {
    badge: 2,
    icon: CreditCard,
    key: 'shadow-it',
    translationKey: 'shadowIt'
  },
  {
    icon: Layers,
    key: 'software-directory',
    translationKey: 'softwareDirectory'
  }
]

const validTabs = new Set<string>([
  'overview',
  'budget-snapshot',
  'renewal-schedule',
  'held-commitments',
  'shadow-it',
  'software-directory'
])

export function isValidFinanceTab(value: string | null): value is FinanceTabKey {
  return value !== null && validTabs.has(value)
}

export function getParentFinanceMenuKey(tab: FinanceTabKey): FinanceTabKey {
  return tab
}
