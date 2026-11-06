import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BudgetTablePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/budgets/budgetTablePageResponseDtoDataItemsItem'
import { useBudgetSummary } from '~/shared/api/generated/operations/budgets/budget-summary'
import { useBudgetTable } from '~/shared/api/generated/operations/budgets/budget-table'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceDetailPage,
  FinanceEmpty,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { BudgetUtilization } from '../../shared/components/budget-utilization'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { usedShare } from '../budget-usage'
import { CostCenterDetail } from '../components/cost-center-detail'
import { CostCenterKpis } from '../components/cost-center-kpis'

const validYear = (value: string) => /^\d{4}$/.test(value) && Number(value) >= 2000 && Number(value) <= 2200

export function FinanceCostCentersView({
  onSelectTab
}: {
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<BudgetTablePageResponseDtoDataItemsItem | null>(null)
  const budgetYear = validYear(year) ? Number(year) : new Date().getFullYear()
  const summary = useBudgetSummary({ year: budgetYear }, { query: { enabled: validYear(year) } })
  const table = useBudgetTable({ year: budgetYear, page, pageSize: 20 }, { query: { enabled: validYear(year) } })
  const totals = Object.values(summary.data?.data?.totals ?? {})
  const money = (value: { amount: string; currency: string }) => formatMoney(value, i18n.language)
  if (selected)
    return (
      <FinanceDetailPage>
        <CostCenterDetail
          row={table.data?.data?.items.find((item) => item.versionId === selected.versionId) ?? selected}
          onClose={() => setSelected(null)}
          onSelectTab={onSelectTab}
        />
      </FinanceDetailPage>
    )
  return (
    <FinancePage title={translate('costCenters')} description={translate('costCentersDescription')}>
      <FinanceToolbar>
        <div className='sm:w-44'>
          <FinanceField label={translate('budgetYear')} error={validYear(year) ? null : translate('invalidYear')}>
            <input
              type='number'
              inputMode='numeric'
              min={2000}
              max={2200}
              aria-invalid={!validYear(year)}
              className={`${financeInputClass} font-mono tabular-nums`}
              placeholder={translate('budgetYearPlaceholder')}
              value={year}
              onChange={(event) => {
                setYear(event.target.value)
                setPage(1)
              }}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>
      <FinanceQueryState query={summary}>
        {totals.length ? (
          <div className='space-y-4'>
            {totals.map((currencyTotals) => (
              <CostCenterKpis key={currencyTotals.currency} totals={currencyTotals} />
            ))}
          </div>
        ) : (
          <FinanceEmpty message={translate('noBudgetForYear', { year: budgetYear })} />
        )}
      </FinanceQueryState>
      <FinanceQueryState query={table}>
        <FinanceTable
          items={table.data?.data?.items ?? []}
          rowKey={(row) => row.versionId}
          onOpen={setSelected}
          columns={[
            {
              key: 'costCenter',
              label: translate('department'),
              render: (row) => (
                <span title={row.costCenter.name}>
                  <span className='block truncate font-medium'>{row.costCenter.name}</span>
                  <span className='block font-mono text-xs text-muted-foreground'>{row.costCenter.code}</span>
                </span>
              )
            },
            { key: 'base', label: translate('kpis.base'), numeric: true, render: (row) => money(row.base) },
            { key: 'reserve', label: translate('kpis.reserve'), numeric: true, render: (row) => money(row.reserve) },
            { key: 'total', label: translate('budgetTotal'), numeric: true, render: (row) => money(row.total) },
            { key: 'committed', label: translate('kpis.held'), numeric: true, render: (row) => money(row.committed) },
            { key: 'spent', label: translate('kpis.spent'), numeric: true, render: (row) => money(row.spent) },
            {
              key: 'remaining',
              label: translate('budgetRemaining'),
              numeric: true,
              render: (row) => (
                <span className={row.overCommitted ? 'font-semibold text-danger-ink' : ''}>{money(row.remaining)}</span>
              )
            },
            {
              key: 'used',
              label: translate('budgetUtilization'),
              numeric: true,
              render: (row) => <BudgetUtilization share={usedShare(row)} overBudget={row.overCommitted} />
            }
          ]}
        />
        <FinancePagination pagination={table.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
    </FinancePage>
  )
}
