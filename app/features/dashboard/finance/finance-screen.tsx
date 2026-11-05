import type { FinanceTabKey } from './enums'
import { FinanceAnnualProposalsView } from './annual-budget/views/finance-annual-proposals-view'
import { FinanceBudgetNegotiationView } from './annual-budget/views/finance-budget-negotiation-view'
import { FinanceCostCentersView } from './cost-centers/views/finance-cost-centers-view'
import { FinanceVendorTaxView } from './vendor-tax/views/finance-vendor-tax-view'
import { FinanceCatalogView } from './catalog/views/finance-catalog-view'
import { FinanceOverviewView } from './overview/views/finance-overview-view'
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
      return <FinanceCostCentersView onSelectTab={onSelectTab} />
    case 'vendor-tax':
      return <FinanceVendorTaxView itemId={itemId} />
    case 'saas-cost':
      return <FinanceCatalogView />
    default:
      return <FinanceUnavailable onSelectTab={onSelectTab} />
  }
}
