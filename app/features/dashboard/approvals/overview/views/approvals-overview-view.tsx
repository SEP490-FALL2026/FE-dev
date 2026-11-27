import { ClipboardCheck, Landmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSpendApprovalList } from '~/shared/api/generated/operations/spend-approvals/spend-approval-list'
import { useBudgetVersionList } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import { BudgetVersionListState } from '~/shared/api/generated/model/budget-versions/budgetVersionListState'
import type { ApprovalTabKey } from '../../approvals-nav'
import { ApprovalsPage } from '../../shared/components/approvals-ui'
import { ApprovalsWorkCard, type WorkCount } from '../components/approvals-work-card'
import { BudgetInsights } from '../components/budget-insights'
import { SpendInsights } from '../components/spend-insights'

interface OverviewProps {
  displayName?: string
  formatCurrency?: (value: number) => string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

/** pageSize=1 keeps the request cheap while pagination.totalItems gives the authoritative count. */
const countParams = { page: 1, pageSize: 1 } as const

function toCount(query: {
  isPending: boolean
  isError: boolean
  data?: { data?: { pagination: { totalItems: number } } | null }
}): WorkCount {
  return { isPending: query.isPending, isError: query.isError, total: query.data?.data?.pagination.totalItems }
}

export function ApprovalsOverviewView({ onSelectTab }: OverviewProps) {
  const { t: translate } = useTranslation('approvalsNeed')
  const spend = useSpendApprovalList(countParams)
  const budgets = useBudgetVersionList({ ...countParams, state: BudgetVersionListState.SENT })
  return (
    <ApprovalsPage title={translate('title')} description={translate('overview.description')}>
      <div className='grid gap-3 sm:grid-cols-2'>
        <ApprovalsWorkCard
          icon={ClipboardCheck}
          title={translate('spendQueue')}
          hint={translate('overview.openSpend')}
          count={toCount(spend)}
          onOpen={() => onSelectTab('queue')}
        />
        <ApprovalsWorkCard
          icon={Landmark}
          title={translate('annualBudget')}
          hint={translate('overview.openBudgets')}
          count={toCount(budgets)}
          onOpen={() => onSelectTab('annual-budget')}
        />
      </div>
      <SpendInsights
        onOpen={(requestId, batchId) =>
          onSelectTab('request', batchId ? { id: requestId, batch: batchId } : { id: requestId })
        }
      />
      <BudgetInsights year={new Date().getFullYear()} onOpenBudgets={() => onSelectTab('annual-budget')} />
    </ApprovalsPage>
  )
}
