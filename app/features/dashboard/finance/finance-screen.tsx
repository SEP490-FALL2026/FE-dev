import type { FinanceTabKey } from './finance-nav'
import { FinanceAnnualProposalsView } from './views/finance-annual-proposals-view'
import { FinanceBudgetAllocationView } from './views/finance-budget-allocation-view'
import { FinanceBudgetCheckView } from './views/finance-budget-check-view'
import { FinanceBudgetExceptionsView } from './views/finance-budget-exceptions-view'
import { FinanceBudgetNegotiationView } from './views/finance-budget-negotiation-view'
import { FinanceBudgetPeriodsView } from './views/finance-budget-periods-view'
import { FinanceBudgetQuestionsView } from './views/finance-budget-questions-view'
import { FinanceBudgetsView } from './views/finance-budgets-view'
import { FinanceChargeExceptionsView } from './views/finance-charge-exceptions-view'
import { FinanceCommitmentsView } from './views/finance-commitments-view'
import { FinanceCostAnalysisView } from './views/finance-cost-analysis-view'
import { FinanceCostForecastView } from './views/finance-cost-forecast-view'
import { FinanceDepartmentBudgetView } from './views/finance-department-budget-view'
import { FinanceDecisionHistoryView } from './views/finance-decision-history-view'
import { FinanceDepartmentSummaryView } from './views/finance-department-summary-view'
import { FinanceOptimizationView } from './views/finance-optimization-view'
import { FinanceOverviewView } from './views/finance-overview-view'
import { FinancePeriodCloseView } from './views/finance-period-close-view'
import { FinancePeriodReportView } from './views/finance-period-report-view'
import { FinanceSaasCostView } from './views/finance-saas-cost-view'
import { FinanceSpendImportView } from './views/finance-spend-import-view'

interface FinanceScreenProps {
  formatCurrency: (value: number) => string
  /** The `id` search param: the record a list screen opens as its detail screen. */
  itemId?: string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
  tab: FinanceTabKey
}

/** Picks the Finance screen for the active tab, so the shared dashboard shell needs one line for this role. */
export function FinanceScreen({ formatCurrency, itemId, onSelectTab, tab }: FinanceScreenProps) {
  const common = { formatCurrency, onSelectTab }

  switch (tab) {
    case 'department-budget':
      return <FinanceDepartmentBudgetView {...common} />
    case 'overview':
      return <FinanceOverviewView {...common} />
    case 'budget-questions':
      return <FinanceBudgetQuestionsView {...common} questionId={itemId} />
    case 'commitments':
      return <FinanceCommitmentsView {...common} commitmentId={itemId} />
    case 'budgets':
      return <FinanceBudgetsView formatCurrency={formatCurrency} />
    case 'budget-allocation':
      return <FinanceBudgetAllocationView {...common} />
    case 'budget-check':
      return <FinanceBudgetCheckView {...common} />
    case 'budget-exceptions':
      return <FinanceBudgetExceptionsView {...common} exceptionId={itemId} />
    case 'saas-cost':
      return <FinanceSaasCostView {...common} />
    case 'annual-proposals':
      return <FinanceAnnualProposalsView {...common} proposalId={itemId} />
    case 'budget-negotiation':
      return <FinanceBudgetNegotiationView {...common} proposalId={itemId} />
    case 'department-summary':
      return <FinanceDepartmentSummaryView {...common} proposalId={itemId} />
    case 'budget-periods':
      return <FinanceBudgetPeriodsView {...common} />
    case 'decision-history':
      return <FinanceDecisionHistoryView formatCurrency={formatCurrency} />
    case 'spend-import':
      return <FinanceSpendImportView {...common} />
    case 'charge-exceptions':
      return <FinanceChargeExceptionsView {...common} exceptionId={itemId} />
    case 'period-close':
      return <FinancePeriodCloseView {...common} costCenterId={itemId} />
    case 'cost-analysis':
      return <FinanceCostAnalysisView {...common} />
    case 'cost-forecast':
      return <FinanceCostForecastView {...common} />
    case 'cost-optimization':
      return <FinanceOptimizationView {...common} opportunityId={itemId} />
    case 'period-report':
      return <FinancePeriodReportView formatCurrency={formatCurrency} />
  }
}
