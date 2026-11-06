import { Building2, CheckCircle2, FileInput, FileUp, Grid2X2, Layers, Lock, ReceiptText, Store } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FINANCE_TAB_KEYS, type FinanceTabKey } from './enums'
export { FINANCE_TAB_KEYS, type FinanceTabKey }

export type FinanceTranslationKey =
  | 'overview'
  | 'costCenters'
  | 'proposals'
  | 'versions'
  | 'spendBatches'
  | 'invoiceIntake'
  | 'commitments'
  | 'catalog'
  | 'vendorTax'

export interface FinanceNavItem {
  key: FinanceTabKey
  icon: LucideIcon
  translationKey: FinanceTranslationKey
}

/**
 * One entry per screen, in the order Finance works through them (overview, then the five budget screens, then the
 * two read-only catalogues). Detail views stay under their list's tab with `?id=`.
 */
export const financeNavItems: readonly FinanceNavItem[] = [
  { key: 'overview', icon: Grid2X2, translationKey: 'overview' },
  { key: 'cost-centers', icon: Building2, translationKey: 'costCenters' },
  { key: 'annual-proposals', icon: FileInput, translationKey: 'proposals' },
  { key: 'budget-negotiation', icon: CheckCircle2, translationKey: 'versions' },
  { key: 'spend-batches', icon: Layers, translationKey: 'spendBatches' },
  { key: 'invoice-intake', icon: FileUp, translationKey: 'invoiceIntake' },
  { key: 'commitments', icon: Lock, translationKey: 'commitments' },
  { key: 'saas-cost', icon: Store, translationKey: 'catalog' },
  { key: 'vendor-tax', icon: ReceiptText, translationKey: 'vendorTax' }
]

/** Legacy tab keys still accepted in URLs; they open the screen that absorbed them. */
const tabAliases: Partial<Record<FinanceTabKey, FinanceTabKey>> = {
  budgets: 'cost-centers',
  'department-budget': 'cost-centers',
  'budget-allocation': 'cost-centers',
  'department-summary': 'annual-proposals',
  'decision-history': 'budget-negotiation'
}

export const financeNavTab = (tab: FinanceTabKey): FinanceTabKey => tabAliases[tab] ?? tab

export function isValidFinanceTab(value: string | null): value is FinanceTabKey {
  return value !== null && (FINANCE_TAB_KEYS as readonly string[]).includes(value)
}
