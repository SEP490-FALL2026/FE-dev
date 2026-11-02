import type { FinanceTabKey } from './enums'
import { FinanceAnnualProposalsView } from './annual-budget/views/finance-annual-proposals-view'
import { FinanceBudgetNegotiationView } from './annual-budget/views/finance-budget-negotiation-view'
import { FinanceBudgetsView } from './annual-budget/views/finance-budgets-view'
import { FinanceBudgetCheckView } from './budget-check/views/finance-budget-check-view'
import { FinanceBudgetQuestionsView } from './budget-questions/views/finance-budget-questions-view'
import { FinanceCommitmentsView } from './commitments/views/finance-commitments-view'
import { FinanceCostCentersView } from './cost-centers/views/finance-cost-centers-view'
import { FinanceExchangeRatesView } from './exchange-rates/views/finance-exchange-rates-view'
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
    case 'budgets':
    case 'department-budget':
    case 'budget-allocation':
      return <FinanceBudgetsView {...details} />
    case 'budget-check':
    case 'budget-exceptions':
      return <FinanceBudgetCheckView {...details} />
    case 'budget-questions':
      return <FinanceBudgetQuestionsView {...details} />
    case 'commitments':
      return <FinanceCommitmentsView {...details} />
    case 'cost-centers':
      return <FinanceCostCentersView />
    case 'exchange-rates':
      return <FinanceExchangeRatesView />
    case 'vendor-tax':
      return <FinanceVendorTaxView itemId={itemId} />
    case 'saas-cost':
      return <FinanceCatalogView />
    default:
      return <FinanceUnavailable onSelectTab={onSelectTab} />
  }
}
