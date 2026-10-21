import {
  AppWindow,
  BookCheck,
  Building2,
  CalendarRange,
  ClipboardCheck,
  ClipboardList,
  FileInput,
  FileSpreadsheet,
  FileText,
  Grid2X2,
  Handshake,
  Landmark,
  LayoutList,
  LineChart,
  MessageSquareText,
  PieChart,
  PiggyBank,
  ReceiptText,
  ScrollText,
  ShieldAlert,
  SquareSplitHorizontal,
  TriangleAlert,
  Wallet
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const FINANCE_TAB_KEYS = [
  'overview',
  'department-budget',
  'budgets',
  'budget-allocation',
  'budget-check',
  'commitments',
  'budget-questions',
  'budget-exceptions',
  'budget-periods',
  'decision-history',
  'department-summary',
  'annual-proposals',
  'budget-negotiation',
  'cost-forecast',
  'cost-optimization',
  'saas-cost',
  'spend-import',
  'charge-exceptions',
  'period-close',
  'cost-analysis',
  'period-report'
] as const

export type FinanceTabKey = (typeof FINANCE_TAB_KEYS)[number]

export type FinanceTranslationKey =
  | 'annualProposals'
  | 'budgetAllocation'
  | 'budgetCheck'
  | 'budgetExceptions'
  | 'budgetNegotiation'
  | 'budgetPeriods'
  | 'budgetQuestions'
  | 'budgets'
  | 'chargeExceptions'
  | 'commitments'
  | 'costAnalysis'
  | 'costForecast'
  | 'costOptimization'
  | 'decisionHistory'
  | 'departmentBudget'
  | 'departmentSummary'
  | 'overview'
  | 'periodClose'
  | 'periodReport'
  | 'saasCost'
  | 'spendImport'

export interface FinanceTab {
  badge?: number
  icon: LucideIcon
  key: FinanceTabKey
  screenCode: string
  translationKey: FinanceTranslationKey
}

export type FinanceAreaKey = 'budget' | 'close' | 'overview' | 'planning' | 'spend'

export interface FinanceArea {
  icon: LucideIcon
  key: FinanceAreaKey
  tabs: readonly FinanceTab[]
}

/**
 * The sidebar shows five areas; opening one expands every screen of that area under it. The URL keeps the screen
 * key (`tab=…`), so links between screens keep working and the area follows from the screen.
 */
export const financeAreas: readonly FinanceArea[] = [
  {
    tabs: [{ icon: Grid2X2, key: 'overview', screenCode: 'FIN-01', translationKey: 'overview' }],
    icon: Grid2X2,
    key: 'overview'
  },
  {
    tabs: [
      { icon: Building2, key: 'department-budget', screenCode: 'FIN-09', translationKey: 'departmentBudget' },
      { badge: 1, icon: Wallet, key: 'budgets', screenCode: 'FIN-06', translationKey: 'budgets' },
      {
        icon: SquareSplitHorizontal,
        key: 'budget-allocation',
        screenCode: 'FIN-45',
        translationKey: 'budgetAllocation'
      },
      { icon: ClipboardCheck, key: 'budget-check', screenCode: 'FIN-08', translationKey: 'budgetCheck' },
      { badge: 3, icon: BookCheck, key: 'commitments', screenCode: 'FIN-20', translationKey: 'commitments' },
      {
        badge: 2,
        icon: MessageSquareText,
        key: 'budget-questions',
        screenCode: 'FIN-05',
        translationKey: 'budgetQuestions'
      },
      {
        badge: 3,
        icon: ShieldAlert,
        key: 'budget-exceptions',
        screenCode: 'FIN-44',
        translationKey: 'budgetExceptions'
      },
      { icon: CalendarRange, key: 'budget-periods', screenCode: 'FIN-43', translationKey: 'budgetPeriods' },
      { icon: ScrollText, key: 'decision-history', screenCode: 'FIN-47', translationKey: 'decisionHistory' },
      { icon: LayoutList, key: 'department-summary', screenCode: 'FIN-42', translationKey: 'departmentSummary' }
    ],
    icon: Landmark,
    key: 'budget'
  },
  {
    tabs: [
      {
        badge: 2,
        icon: FileInput,
        key: 'annual-proposals',
        screenCode: 'FIN-40',
        translationKey: 'annualProposals'
      },
      { icon: Handshake, key: 'budget-negotiation', screenCode: 'FIN-41', translationKey: 'budgetNegotiation' },
      { icon: LineChart, key: 'cost-forecast', screenCode: 'FIN-33', translationKey: 'costForecast' },
      {
        badge: 3,
        icon: PiggyBank,
        key: 'cost-optimization',
        screenCode: 'FIN-35',
        translationKey: 'costOptimization'
      }
    ],
    icon: LineChart,
    key: 'planning'
  },
  {
    tabs: [
      { icon: AppWindow, key: 'saas-cost', screenCode: 'FIN-46', translationKey: 'saasCost' },
      { icon: FileSpreadsheet, key: 'spend-import', screenCode: 'FIN-04', translationKey: 'spendImport' },
      {
        badge: 3,
        icon: TriangleAlert,
        key: 'charge-exceptions',
        screenCode: 'FIN-07',
        translationKey: 'chargeExceptions'
      }
    ],
    icon: ReceiptText,
    key: 'spend'
  },
  {
    tabs: [
      { icon: ClipboardList, key: 'period-close', screenCode: 'FIN-30', translationKey: 'periodClose' },
      { icon: PieChart, key: 'cost-analysis', screenCode: 'FIN-32', translationKey: 'costAnalysis' },
      { icon: FileText, key: 'period-report', screenCode: 'FIN-34', translationKey: 'periodReport' }
    ],
    icon: ClipboardList,
    key: 'close'
  }
]

export const areaTabs = (area: FinanceArea) => area.tabs

export function financeAreaOf(tab: FinanceTabKey): FinanceArea {
  return financeAreas.find((area) => areaTabs(area).some((item) => item.key === tab)) ?? financeAreas[0]
}

/** The sidebar badge of an area adds up the badges of its screens. */
export function areaBadge(area: FinanceArea) {
  const total = areaTabs(area).reduce((sum, item) => sum + (item.badge ?? 0), 0)
  return total > 0 ? total : undefined
}

export function isValidFinanceTab(value: string | null): value is FinanceTabKey {
  return value !== null && (FINANCE_TAB_KEYS as readonly string[]).includes(value)
}
