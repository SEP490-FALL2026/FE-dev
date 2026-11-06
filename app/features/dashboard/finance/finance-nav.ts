import {
  Building2,
  CalendarRange,
  FileInput,
  FileText,
  Grid2X2,
  Landmark,
  Layers,
  LineChart,
  ReceiptText
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FINANCE_TAB_KEYS, type FinanceTabKey } from './enums'
export { FINANCE_TAB_KEYS, type FinanceTabKey }

export type FinanceAreaKey = 'budget' | 'close' | 'overview' | 'planning' | 'spend'
export type FinanceTranslationKey =
  | 'overview'
  | 'costCenters'
  | 'budgets'
  | 'proposals'
  | 'versions'
  | 'spendBatches'
  | 'commitments'
  | 'catalog'
  | 'vendorTax'
  | 'periodClose'
  | 'periodReport'

export interface FinanceTab {
  key: FinanceTabKey
  icon: LucideIcon
  translationKey: FinanceTranslationKey
}
export interface FinanceArea {
  icon: LucideIcon
  key: FinanceAreaKey
  tabs: readonly FinanceTab[]
}

export const financeAreas: readonly FinanceArea[] = [
  { key: 'overview', icon: Grid2X2, tabs: [{ key: 'overview', icon: Grid2X2, translationKey: 'overview' }] },
  {
    key: 'budget',
    icon: Landmark,
    tabs: [{ key: 'cost-centers', icon: Building2, translationKey: 'costCenters' }]
  },
  {
    key: 'planning',
    icon: LineChart,
    tabs: [
      { key: 'annual-proposals', icon: FileInput, translationKey: 'proposals' },
      { key: 'budget-negotiation', icon: CalendarRange, translationKey: 'versions' }
    ]
  },
  {
    key: 'spend',
    icon: ReceiptText,
    tabs: [
      { key: 'spend-batches', icon: Layers, translationKey: 'spendBatches' },
      { key: 'commitments', icon: ReceiptText, translationKey: 'commitments' }
    ]
  },
  {
    key: 'close',
    icon: FileText,
    tabs: [
      { key: 'period-close', icon: CalendarRange, translationKey: 'periodClose' },
      { key: 'period-report', icon: FileText, translationKey: 'periodReport' }
    ]
  }
]

export const areaTabs = (area: FinanceArea) => area.tabs
export function financeAreaOf(tab: FinanceTabKey): FinanceArea {
  return financeAreas.find((area) => area.tabs.some((item) => item.key === tab)) ?? financeAreas[0]
}
export function isValidFinanceTab(value: string | null): value is FinanceTabKey {
  return value !== null && (FINANCE_TAB_KEYS as readonly string[]).includes(value)
}
