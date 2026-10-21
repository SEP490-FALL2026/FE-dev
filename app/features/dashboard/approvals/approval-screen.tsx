import type { ApprovalTabKey } from './approvals-nav'
import { ApprovalAnnualBudgetView } from './views/approval-annual-budget-view'
import { ApprovalChargeView } from './views/approval-charge-view'
import { ApprovalDecisionHistoryView } from './views/approval-decision-history-view'
import { ApprovalExceptionsView } from './views/approval-exceptions-view'
import { ApprovalOptimizationView } from './views/approval-optimization-view'
import { ApprovalQueueView } from './views/approval-queue-view'
import { ApprovalRenewalView } from './views/approval-renewal-view'
import { ApprovalRequestView } from './views/approval-request-view'
import { ApprovalsOverviewView } from './views/approvals-overview-view'
import { ApproverReportsView } from './views/approver-reports-view'

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
