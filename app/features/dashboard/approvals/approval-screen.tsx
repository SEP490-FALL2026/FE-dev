import type { ApprovalTabKey } from './approvals-nav'
import { ApprovalAnnualBudgetView } from './annual-budget/views/approval-annual-budget-view'
import { ApprovalChargeView } from './queue/views/approval-charge-view'
import { ApprovalDecisionHistoryView } from './decisions/views/approval-decision-history-view'
import { ApprovalExceptionsView } from './exceptions/views/approval-exceptions-view'
import { ApprovalOptimizationView } from './queue/views/approval-optimization-view'
import { ApprovalQueueView } from './queue/views/approval-queue-view'
import { ApprovalRenewalView } from './queue/views/approval-renewal-view'
import { ApprovalRequestView } from './queue/views/approval-request-view'
import { ApprovalsOverviewView } from './overview/views/approvals-overview-view'
import { ApproverReportsView } from './decisions/views/approver-reports-view'

interface ApprovalScreenProps {
  displayName: string
  formatCurrency: (value: number) => string
  /** The `id` search param: the item a list screen opens as its detail screen. */
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
  tab: ApprovalTabKey
}

/** Picks the Spending Approver screen for the active tab, so the shared dashboard shell needs one line for this role. */
export function ApprovalScreen({ displayName, formatCurrency, itemId, onSelectTab, tab }: ApprovalScreenProps) {
  const common = { formatCurrency, onSelectTab }

  switch (tab) {
    case 'overview':
      return <ApprovalsOverviewView {...common} displayName={displayName} />
    case 'queue':
      return <ApprovalQueueView {...common} />
    case 'request':
      return <ApprovalRequestView {...common} itemId={itemId} />
    case 'renewal':
      return <ApprovalRenewalView {...common} itemId={itemId} />
    case 'charge':
      return <ApprovalChargeView {...common} itemId={itemId} />
    case 'optimization':
      return <ApprovalOptimizationView {...common} itemId={itemId} />
    case 'annual-budget':
      return <ApprovalAnnualBudgetView {...common} itemId={itemId} />
    case 'exception-approval':
      return <ApprovalExceptionsView {...common} itemId={itemId} />
    case 'decision-history':
      return <ApprovalDecisionHistoryView formatCurrency={formatCurrency} />
    case 'reports':
      return <ApproverReportsView formatCurrency={formatCurrency} />
  }
}
