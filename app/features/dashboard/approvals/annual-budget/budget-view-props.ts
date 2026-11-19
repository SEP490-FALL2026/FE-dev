import type { ApprovalTabKey } from '../approvals-nav'

export interface ApprovalBudgetViewProps {
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
  formatCurrency?: (value: number) => string
}
