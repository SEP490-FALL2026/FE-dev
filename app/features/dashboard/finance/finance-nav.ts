import {
  BookCheck,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Grid2X2,
  MessageSquareText,
  PieChart,
  TriangleAlert,
  Wallet
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const FINANCE_TAB_KEYS = [
  'overview',
  'budget-questions',
  'commitments',
  'budgets',
  'spend-import',
  'charge-exceptions',
  'period-close',
  'cost-analysis',
  'period-report'
] as const

export type FinanceTabKey = (typeof FINANCE_TAB_KEYS)[number]

export type FinanceTranslationKey =
  | 'overview'
  | 'budgetQuestions'
  | 'commitments'
  | 'budgets'
  | 'spendImport'
  | 'chargeExceptions'
  | 'periodClose'
  | 'costAnalysis'
  | 'periodReport'

export interface FinanceNavItem {
  badge?: number
  icon: LucideIcon
  key: FinanceTabKey
  screenCode: string
  translationKey: FinanceTranslationKey
}

export interface FinanceNavSection {
  items: readonly FinanceNavItem[]
  key: string
  /** Section heading key under `finance.nav.sections`; the overview section has none. */
  titleKey?: 'budget' | 'reconciliation' | 'periodClose'
}

/** Grouped by the Finance user flows: UF-11 (budget), UF-12 (reconciliation), UF-19 (period close). */
export const financeNavSections: readonly FinanceNavSection[] = [
  {
    items: [{ icon: Grid2X2, key: 'overview', screenCode: 'FIN-01', translationKey: 'overview' }],
    key: 'home'
  },
  {
    items: [
      {
        badge: 2,
        icon: MessageSquareText,
        key: 'budget-questions',
        screenCode: 'FIN-05',
        translationKey: 'budgetQuestions'
      },
      { badge: 3, icon: BookCheck, key: 'commitments', screenCode: 'FIN-20', translationKey: 'commitments' },
      { badge: 1, icon: Wallet, key: 'budgets', screenCode: 'FIN-06', translationKey: 'budgets' }
    ],
    key: 'budget',
    titleKey: 'budget'
  },
  {
    items: [
      { icon: FileSpreadsheet, key: 'spend-import', screenCode: 'FIN-04', translationKey: 'spendImport' },
      {
        badge: 3,
        icon: TriangleAlert,
        key: 'charge-exceptions',
        screenCode: 'FIN-07',
        translationKey: 'chargeExceptions'
      }
    ],
    key: 'reconciliation',
    titleKey: 'reconciliation'
  },
  {
    items: [
      { icon: ClipboardList, key: 'period-close', screenCode: 'FIN-30', translationKey: 'periodClose' },
      { icon: PieChart, key: 'cost-analysis', screenCode: 'FIN-32', translationKey: 'costAnalysis' },
      { icon: FileText, key: 'period-report', screenCode: 'FIN-34', translationKey: 'periodReport' }
    ],
    key: 'period-close',
    titleKey: 'periodClose'
  }
]

export function isValidFinanceTab(value: string | null): value is FinanceTabKey {
  return value !== null && (FINANCE_TAB_KEYS as readonly string[]).includes(value)
}
