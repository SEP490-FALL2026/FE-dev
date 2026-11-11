import { useState } from 'react'
import { parseYearFilter } from '../../shared/finance-validation'
import { useTranslation } from 'react-i18next'
import { useBudgetProposalList } from '~/shared/api/generated/operations/budget-proposals/budget-proposal-list'
import type { BudgetProposalListState } from '~/shared/api/generated/model/budget-proposals/budgetProposalListState'
import { FinancePage, FinancePagination, FinanceQueryState, FinanceStatus } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import { formatMoney } from '../../shared/finance-money'
import type { BudgetViewProps } from '../budget-view-props'
import { BudgetListFilters } from '../components/budget-list-filters'
import { BudgetProposalDetail } from '../components/budget-proposal-detail'
import { proposalStates } from '../enums/proposal-state'

export function FinanceAnnualProposalsView(props: BudgetViewProps) {
  if (props.itemId) return <BudgetProposalDetail key={props.itemId} {...props} itemId={props.itemId} />
  return <ProposalList {...props} />
}

function ProposalList({ onSelectTab }: BudgetViewProps) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const { page, pageSize, setPage, year, setYear } = useFinanceList()
  const [state, setState] = useState<BudgetProposalListState>()
  const query = useBudgetProposalList({
    page,
    pageSize,
    ...(parseYearFilter(year) ? { year: parseYearFilter(year) } : {}),
    ...(state ? { state } : {})
  })
  const result = query.data?.data
  return (
    <FinancePage title={translate('proposals')}>
      <BudgetListFilters
        year={year}
        onYearChange={setYear}
        states={proposalStates}
        state={state}
        onStateChange={(value) => {
          setState(value)
          setPage(1)
        }}
      />
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(proposal) => proposal.id}
          onOpen={(proposal) => onSelectTab?.('annual-proposals', { id: proposal.id })}
          columns={[
            {
              key: 'costCenter',
              label: translate('fields.costCenter'),
              render: (proposal) => proposal.costCenter.name
            },
            {
              key: 'year',
              label: translate('fields.year'),
              numeric: true,
              align: 'center',
              render: (proposal) => proposal.year
            },
            {
              key: 'state',
              label: translate('fields.state'),
              render: (proposal) => <FinanceStatus value={proposal.state} />
            },
            {
              key: 'total',
              label: translate('fields.total'),
              numeric: true,
              render: (proposal) => formatMoney(proposal.total, i18n.language)
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
