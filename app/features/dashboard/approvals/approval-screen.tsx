import type { ApprovalTabKey } from './enums'
import { ApprovalAnnualBudgetView } from './annual-budget/views/approval-annual-budget-view'
import { ApprovalQueueView } from './queue/views/spend-queue-view'
import { ApprovalRequestView } from './queue/views/spend-request-view'
import { ApprovalBatchView } from './queue/views/spend-batch-view'
import { ApprovalNeedView } from './need/views/approval-need-view'
import { ApprovalsOverviewView } from './overview/views/approvals-overview-view'
import { ApprovalUnavailable } from './shared/components/approval-unavailable'

interface ApprovalScreenProps {
  displayName: string
  formatCurrency: (value: number) => string
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
  tab: ApprovalTabKey
}

export function ApprovalScreen({ itemId, onSelectTab, tab }: ApprovalScreenProps) {
  switch (tab) {
    case 'overview':
      return <ApprovalsOverviewView onSelectTab={onSelectTab} />
    case 'queue':
      return <ApprovalQueueView onSelectTab={onSelectTab} />
    case 'request':
    case 'renewal':
      return <ApprovalRequestView itemId={itemId} onSelectTab={onSelectTab} />
    case 'batch':
      return <ApprovalBatchView itemId={itemId} onSelectTab={onSelectTab} />
    case 'need':
      return <ApprovalNeedView itemId={itemId} onSelectTab={onSelectTab} />
    case 'annual-budget':
      return <ApprovalAnnualBudgetView itemId={itemId} onSelectTab={onSelectTab} />
    default:
      return <ApprovalUnavailable onSelectTab={onSelectTab} />
  }
}
