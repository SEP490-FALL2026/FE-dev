import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetCycleList } from '~/shared/api/generated/operations/budget-cycles'
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
import type { BudgetViewProps } from '../../annual-budget/budget-view-props'
import { CycleDetail } from '../components/cycle-detail'
import { CycleOpenDialog } from '../components/cycle-open-dialog'

export function FinanceBudgetCyclesView({ itemId, onSelectTab }: BudgetViewProps) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const { page, pageSize, setPage } = useFinanceList()
  const [opening, setOpening] = useState(false)
  const query = useBudgetCycleList({ page, pageSize })
  const result = query.data?.data
  const selectedYear = itemId && /^\d{4}$/.test(itemId) ? Number(itemId) : undefined

  if (selectedYear !== undefined)
    return <CycleDetail year={selectedYear} onBack={() => onSelectTab?.('budget-cycles')} />

  return (
    <FinancePage
      title={translate('budgetCycle.title')}
      actions={
        <FinanceButton variant='primary' onClick={() => setOpening(true)}>
          {translate('budgetCycle.open')}
        </FinanceButton>
      }
    >
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(cycle) => String(cycle.year)}
          onOpen={(cycle) => onSelectTab?.('budget-cycles', { id: String(cycle.year) })}
          columns={[
            {
              key: 'year',
              label: translate('fields.year'),
              numeric: true,
              align: 'center',
              render: (cycle) => cycle.year
            },
            {
              key: 'status',
              label: translate('fields.state'),
              render: (cycle) => (
                <FinanceStatus
                  value={cycle.status}
                  label={translate(`budgetCycle.status.${cycle.status}`, { defaultValue: translate('unknown') })}
                />
              )
            },
            {
              key: 'ceiling',
              label: translate('budgetCycle.annualCeiling'),
              numeric: true,
              render: (cycle) => formatMoney(cycle.annualCeiling, i18n.language)
            },
            {
              key: 'allocated',
              label: translate('budgetCycle.allocated'),
              numeric: true,
              render: (cycle) => formatMoney(cycle.allocated, i18n.language)
            },
            {
              key: 'submission',
              label: translate('budgetCycle.submissionDeadline'),
              numeric: true,
              align: 'center',
              render: (cycle) => cycle.submissionDeadline
            },
            {
              key: 'decision',
              label: translate('budgetCycle.decisionDeadline'),
              numeric: true,
              align: 'center',
              render: (cycle) => cycle.decisionDeadline
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {opening && (
        <CycleOpenDialog
          onClose={() => setOpening(false)}
          onOpened={(year) => onSelectTab?.('budget-cycles', { id: String(year) })}
        />
      )}
    </FinancePage>
  )
}
