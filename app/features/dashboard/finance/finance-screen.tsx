import type { FinanceTabKey } from './enums'
import { FinanceAnnualProposalsView } from './annual-budget/views/finance-annual-proposals-view'
import { FinanceBudgetNegotiationView } from './annual-budget/views/finance-budget-negotiation-view'
import { CommitmentDetail } from './commitments/components/commitment-detail'
import { FinanceCommitmentsView } from './commitments/views/finance-commitments-view'
import { FinanceInvoiceIntakeView } from './commitments/views/finance-invoice-intake-view'
import { FinanceCostCentersView } from './cost-centers/views/finance-cost-centers-view'
import { FinanceSpendBatchesView } from './spend-batches/views/finance-spend-batches-view'
import { FinanceVendorTaxView } from './vendor-tax/views/finance-vendor-tax-view'
import { FinanceCatalogView } from './catalog/views/finance-catalog-view'
import { FinanceOverviewView } from './overview/views/finance-overview-view'

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
    case 'annual-proposals':
      return <FinanceAnnualProposalsView {...details} />
    case 'budget-negotiation':
      return <FinanceBudgetNegotiationView {...details} />
    case 'department-summary':
      return <FinanceAnnualProposalsView {...details} />
    case 'decision-history':
      return <FinanceBudgetNegotiationView onSelectTab={onSelectTab} />
    // Current budgets live on the cost center screen; the old budget tabs keep working as links.
    case 'cost-centers':
    case 'budgets':
    case 'department-budget':
    case 'budget-allocation':
      return (
        <FinanceCostCentersView
          onSelectTab={onSelectTab}
          renderCommitment={(target) => (
            <CommitmentDetail
              key={target.id}
              id={target.id}
              requestId={target.requestId}
              onClose={target.onClose}
              backLabel={target.backLabel}
            />
          )}
        />
      )
    case 'commitments':
      return <FinanceCommitmentsView {...details} />
    case 'invoice-intake':
      return <FinanceInvoiceIntakeView />
    case 'spend-batches':
      return <FinanceSpendBatchesView {...details} />
    case 'vendor-tax':
      return <FinanceVendorTaxView itemId={itemId} />
    case 'saas-cost':
      return <FinanceCatalogView />
  }
}
