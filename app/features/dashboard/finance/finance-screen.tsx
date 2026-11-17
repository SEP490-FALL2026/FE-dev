import type { FinanceTabKey } from './enums'
import { FinanceAnnualProposalsView } from './annual-budget/views/finance-annual-proposals-view'
import { FinanceBudgetNegotiationView } from './annual-budget/views/finance-budget-negotiation-view'
import { FinanceVersionHistoryView } from './annual-budget/views/finance-version-history-view'
import { FinanceBudgetCyclesView } from './budget-cycles/views/finance-budget-cycles-view'
import { FinanceCostCentersView } from './cost-centers/views/finance-cost-centers-view'
import { FinanceSpendBatchesView } from './spend-batches/views/finance-spend-batches-view'
import { FinanceCommitmentsView } from './commitments/views/finance-commitments-view'
import { FinanceRequestMonitorView } from './request-monitor/views/finance-request-monitor-view'
import { FinancePurchaseInvoicesView } from './purchase-invoices/views/finance-purchase-invoices-view'
import { FinanceDiscrepanciesView } from './reconciliation/views/finance-discrepancies-view'
import { FinanceOutOfProcessView } from './reconciliation/views/finance-out-of-process-view'
import { FinanceCommitmentReleaseView } from './commitments/views/finance-commitment-release-view'
import { FinanceCommitmentDetailView } from './commitments/views/finance-commitment-detail-view'
import { FinanceVendorTaxView } from './vendor-tax/views/finance-vendor-tax-view'
import { FinanceCatalogView } from './catalog/views/finance-catalog-view'
import { FinanceOverviewView } from './overview/views/finance-overview-view'
import { FinanceReviewPeriodsView } from './in-year-review/views/finance-review-periods-view'
import { FinanceSeatChargesView } from './in-year-review/views/finance-seat-charges-view'
import { FinanceAdjustmentsView } from './in-year-review/views/finance-adjustments-view'
import { FinanceBudgetParametersView } from './budget-parameters/views/finance-budget-parameters-view'
import { FinanceSubscriptionRenewalsView } from './subscription-renewals/views/finance-subscription-renewals-view'
import { FinanceUnavailable } from './shared/components/finance-unavailable'

interface FinanceScreenProps {
  formatCurrency?: (value: number) => string
  itemId?: string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
  tab: FinanceTabKey
}

export function FinanceScreen({ itemId, onSelectTab, tab }: FinanceScreenProps) {
  const details = { itemId, onSelectTab }
  switch (tab) {
    case 'overview':
      return <FinanceOverviewView onSelectTab={onSelectTab} />
    case 'budget-cycles':
      return <FinanceBudgetCyclesView {...details} />
    case 'annual-proposals':
      return <FinanceAnnualProposalsView {...details} />
    case 'budget-negotiation':
      return <FinanceBudgetNegotiationView {...details} />
    case 'version-history':
      return <FinanceVersionHistoryView {...details} />
    case 'department-summary':
      return <FinanceAnnualProposalsView {...details} />
    case 'decision-history':
      return <FinanceBudgetNegotiationView onSelectTab={onSelectTab} />
    // Current budgets live on the cost center screen; the old budget tabs keep working as links.
    case 'cost-centers':
    case 'budgets':
    case 'department-budget':
    case 'budget-allocation':
      return <FinanceCostCentersView onSelectTab={onSelectTab} />
    case 'spend-batches':
      return <FinanceSpendBatchesView {...details} />
    case 'request-monitor':
      return <FinanceRequestMonitorView {...details} />
    case 'purchase-invoices':
      return <FinancePurchaseInvoicesView {...details} />
    case 'invoice-discrepancies':
      return <FinanceDiscrepanciesView {...details} />
    case 'out-of-process':
      return <FinanceOutOfProcessView />
    case 'commitments':
      return <FinanceCommitmentsView onSelectTab={onSelectTab} />
    case 'commitment-detail':
      return <FinanceCommitmentDetailView itemId={itemId} onSelectTab={onSelectTab} />
    case 'commitment-release':
      return <FinanceCommitmentReleaseView itemId={itemId} onSelectTab={onSelectTab} />
    case 'period-close':
      return <FinanceReviewPeriodsView {...details} />
    case 'seat-charges':
      return <FinanceSeatChargesView />
    case 'budget-adjustments':
      return <FinanceAdjustmentsView />
    case 'budget-parameters':
      return <FinanceBudgetParametersView />
    case 'vendor-tax':
      return <FinanceVendorTaxView itemId={itemId} />
    case 'saas-cost':
      return <FinanceCatalogView />
    case 'subscription-renewals':
      return <FinanceSubscriptionRenewalsView {...details} />
    default:
      return <FinanceUnavailable onSelectTab={onSelectTab} />
  }
}
