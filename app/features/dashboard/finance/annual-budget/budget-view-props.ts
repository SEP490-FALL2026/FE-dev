import type { FinanceTabKey } from '../enums'

export interface BudgetViewProps {
  itemId?: string
  onSelectTab?: (tab: FinanceTabKey, extra?: Record<string, string>) => void
  formatCurrency?: (value: number) => string
}
