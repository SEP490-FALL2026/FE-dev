import { useFinanceSearch } from '../../shared/hooks/use-finance-search'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import { CostCenterListStatus } from '../enums/cost-center-status'

import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceField,
  FinanceDetailPage,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  FinanceSearch,
  FinanceSelect,
  FinanceStatus,
  FinanceToolbar,
  financeInputClass
} from '../../shared/components/finance-ui'
import { BudgetUtilization } from '../../shared/components/budget-utilization'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { CostCenterDetail } from '../components/cost-center-detail'
import { CostCenterKpis } from '../components/cost-center-kpis'
import { useCurrentBudgetsByCostCenter } from '../hooks/use-cost-center-budgets'
import { useBudgetSummary } from '../hooks/use-budget-summary'

const validYear = (value: string) => /^\d{4}$/.test(value) && Number(value) >= 2000 && Number(value) <= 2200

export function FinanceCostCentersView({
  onSelectTab
}: {
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { search, setSearch, debouncedSearch } = useFinanceSearch()
  const [status, setStatus] = useState<CostCenterListStatus | ''>('')
  const [page, setPage] = useState(1)
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [selected, setSelected] = useState<CostCenterPageResponseDtoDataItemsItem | null>(null)

  const centers = useCostCenterList({
    search: debouncedSearch || undefined,
    status: status || undefined,
    page,
    pageSize: 20
  })

  const budgetYear = validYear(year) ? Number(year) : undefined
  const budgets = useCurrentBudgetsByCostCenter(budgetYear)
  const summary = useBudgetSummary(budgetYear)
  const activeCenters = useCostCenterList({ status: CostCenterListStatus.ACTIVE, page: 1, pageSize: 1 })

  const budgetOf = (item: CostCenterPageResponseDtoDataItemsItem) => budgets.data?.byCostCenter.get(item.id)

  const budgetCell = (item: CostCenterPageResponseDtoDataItemsItem, field: 'total' | 'remaining') => {
    if (budgets.isPending || budgets.isError) return <span className='text-muted-foreground'>—</span>
    const budget = budgetOf(item)
    if (!budget) return <span className='text-muted-foreground'>{translate('noBudget')}</span>
    return formatMoney(budget[field], i18n.language)
  }

  if (selected)
    return (
      <FinanceDetailPage>
        <CostCenterDetail
          item={centers.data?.data?.items.find((item) => item.id === selected.id) ?? selected}
          year={budgetYear}
          onClose={() => setSelected(null)}
          onSelectTab={onSelectTab}
        />
      </FinanceDetailPage>
    )

  return (
    <FinancePage title={translate('costCenters')} description={translate('costCentersDescription')}>
      <FinanceToolbar>
        <FinanceSearch
          label={translate('searchCenters')}
          placeholder={translate('searchCentersPlaceholder')}
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
        />
        <div className='sm:w-52'>
          <FinanceField label={translate('status')}>
            <FinanceSelect
              value={status}
              onChange={(event) => {
                setStatus(Object.values(CostCenterListStatus).find((value) => value === event.target.value) ?? '')
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {Object.values(CostCenterListStatus).map((value) => (
                <option key={value} value={value}>
                  {translate(`enum.${value}`)}
                </option>
              ))}
            </FinanceSelect>
          </FinanceField>
        </div>
        <div className='sm:w-40'>
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
              onChange={(event) => setYear(event.target.value)}
            />
          </FinanceField>
        </div>
      </FinanceToolbar>

      {summary.totals && (
        <CostCenterKpis
          totals={summary.totals}
          lastInvoiceRecordedAt={summary.lastInvoiceRecordedAt}
          activeCenters={activeCenters.data?.data?.pagination.totalItems}
        />
      )}

      <FinanceQueryState query={centers}>
        <FinanceTable
          items={centers.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          onOpen={setSelected}
          columns={[
            {
              key: 'name',
              label: translate('name'),
              render: (item) => (
                <div className='min-w-0'>
                  <div className='truncate font-medium text-foreground' title={item.name}>
                    {item.name}
                  </div>
                  <div className='font-mono text-[11px] text-muted-foreground'>{item.code}</div>
                </div>
              )
            },
            { key: 'status', label: translate('status'), render: (item) => <FinanceStatus value={item.status} /> },
            {
              key: 'total',
              label: translate('budgetTotal'),
              numeric: true,
              render: (item) => budgetCell(item, 'total')
            },
            {
              key: 'remaining',
              label: translate('budgetRemaining'),
              numeric: true,
              render: (item) => budgetCell(item, 'remaining')
            },
            {
              key: 'utilization',
              label: translate('budgetUtilization'),
              numeric: true,
              render: (item) => {
                const budget = budgetOf(item)
                return budget ? (
                  <BudgetUtilization
                    total={budget.total}
                    committed={budget.committed}
                    spent={budget.spent}
                    overCommitted={budget.overCommitted}
                  />
                ) : null
              }
            }
          ]}
        />
        <FinancePagination pagination={centers.data?.data?.pagination} onPageChange={setPage} />
        {budgets.data?.truncated && <p className='text-xs text-muted-foreground'>{translate('listTruncated')}</p>}
      </FinanceQueryState>
    </FinancePage>
  )
}
