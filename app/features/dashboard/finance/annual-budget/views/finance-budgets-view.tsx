import { useTranslation } from 'react-i18next'
import { useBudgetTable } from '~/shared/api/generated/operations/budgets/budget-table'
import { FinancePage, FinancePagination, FinanceQueryState } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceList } from '../../shared/hooks/use-finance-list'
import { formatMoney } from '../../shared/finance-money'
import type { BudgetViewProps } from '../budget-view-props'
import { BudgetListFilters } from '../components/budget-list-filters'

export function FinanceBudgetsView({ onSelectTab }: BudgetViewProps) {
  const { t: translate, i18n } = useTranslation('financeBudget')
  const { page, pageSize, setPage, year, setYear } = useFinanceList()
  const query = useBudgetTable({ page, pageSize, ...(year ? { year: Number(year) } : {}) })
  const result = query.data?.data
  return (
    <FinancePage title={translate('budgets')}>
      <BudgetListFilters year={year} onYearChange={setYear} />
      <FinanceQueryState query={query}>
        <FinanceTable
          items={result?.items ?? []}
          rowKey={(budget) => budget.versionId}
          onOpen={(budget) => onSelectTab?.('budget-negotiation', { id: budget.versionId })}
          columns={[
            { key: 'costCenter', label: translate('fields.costCenter'), render: (budget) => budget.costCenter.name },
            { key: 'year', label: translate('fields.year'), numeric: true, render: (budget) => budget.year },
            {
              key: 'total',
              label: translate('fields.total'),
              numeric: true,
              render: (budget) => formatMoney(budget.total, i18n.language)
            },
            {
              key: 'committed',
              label: translate('fields.committed'),
              numeric: true,
              render: (budget) => formatMoney(budget.committed, i18n.language)
            },
            {
              key: 'spent',
              label: translate('fields.spent'),
              numeric: true,
              render: (budget) => formatMoney(budget.spent, i18n.language)
            },
            {
              key: 'remaining',
              label: translate('fields.remaining'),
              numeric: true,
              render: (budget) => formatMoney(budget.remaining, i18n.language)
            },
            {
              key: 'overCommitted',
              label: translate('fields.overCommitted'),
              render: (budget) => translate(budget.overCommitted ? 'yes' : 'no')
            }
          ]}
        />
        <FinancePagination pagination={result?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
