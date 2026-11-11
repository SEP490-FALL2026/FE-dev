import { useState } from 'react'
import { parseYearFilter } from '../../shared/finance-validation'
import { useTranslation } from 'react-i18next'
import { useBudgetVersionList } from '~/shared/api/generated/operations/budget-versions/budget-version-list'
import type { BudgetVersionListState } from '~/shared/api/generated/model/budget-versions/budgetVersionListState'
import {
  FinanceButton,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import { formatMoney } from '../../shared/finance-money'
import type { BudgetViewProps } from '../budget-view-props'
import { BudgetListFilters } from '../components/budget-list-filters'
import { BudgetVersionDetail } from '../components/budget-version-detail'
import { versionStates } from '../enums/version-state'

export function FinanceBudgetNegotiationView(props: BudgetViewProps) {
  if (props.itemId) return <BudgetVersionDetail key={props.itemId} {...props} itemId={props.itemId} />
  return <VersionList {...props} />
}

function VersionList({ onSelectTab }: BudgetViewProps) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const { page, pageSize, setPage, year, setYear } = useFinanceList()
  const [state, setState] = useState<BudgetVersionListState>()
  const query = useBudgetVersionList({
    page,
    pageSize,
    ...(parseYearFilter(year) ? { year: parseYearFilter(year) } : {}),
    ...(state ? { state } : {})
  })
  const result = query.data?.data
  return (
    <FinancePage
      title={translate('versions')}
      actions={
        <FinanceButton variant='primary' onClick={() => onSelectTab?.('annual-proposals')}>
          {translate('actions.openProposals')}
        </FinanceButton>
      }
    >
      <BudgetListFilters
        year={year}
        onYearChange={setYear}
        states={versionStates}
        state={state}
        onStateChange={(value) => {
          setState(value)
          setPage(1)
        }}
      />
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(version) => version.id}
          onOpen={(version) => onSelectTab?.('budget-negotiation', { id: version.id })}
          columns={[
            { key: 'costCenter', label: translate('fields.costCenter'), render: (version) => version.costCenter.name },
            {
              key: 'year',
              label: translate('fields.year'),
              numeric: true,
              align: 'center',
              render: (version) => version.year
            },
            {
              key: 'number',
              label: translate('fields.number'),
              numeric: true,
              align: 'center',
              render: (version) => version.number
            },
            {
              key: 'state',
              label: translate('fields.state'),
              render: (version) => <FinanceStatus value={version.state} />
            },
            {
              key: 'total',
              label: translate('fields.total'),
              numeric: true,
              render: (version) => formatMoney(version.total, i18n.language)
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
