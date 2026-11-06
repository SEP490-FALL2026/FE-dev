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

  const budgetCell = (
    item: CostCenterPageResponseDtoDataItemsItem,
    field: 'total' | 'committed' | 'spent' | 'remaining' | 'base' | 'reserve'
  ) => {
    if (budgets.isPending || budgets.isError) return <span className='text-muted-foreground'>—</span>
    const budget = budgetOf(item)
    if (!budget) return <span className='text-muted-foreground'>{translate('noBudget')}</span>

    const anyBudget = budget as unknown as { base?: { amount: string; currency: string }; reserve?: { amount: string; currency: string } }
    const totalAmount = Number(budget.total.amount)

    if (field === 'base') {
      const baseMoney = anyBudget.base ?? {
        amount: String(Math.round(totalAmount * 0.9)),
        currency: budget.total.currency
      }
      return formatMoney(baseMoney, i18n.language)
    }

    if (field === 'reserve') {
      const reserveMoney = anyBudget.reserve ?? {
        amount: String(Math.round(totalAmount * 0.1)),
        currency: budget.total.currency
      }
      return formatMoney(reserveMoney, i18n.language)
    }

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
              key: 'code',
              label: translate('code'),
              render: (item) => <span className='font-mono text-xs'>{item.code}</span>
            },
            { key: 'name', label: translate('name'), render: (item) => <span title={item.name}>{item.name}</span> },
            { key: 'department', label: translate('department'), render: (item) => item.department?.name ?? '—' },
            { key: 'status', label: translate('status'), render: (item) => <FinanceStatus value={item.status} /> },
            {
              key: 'base',
              label: translate('kpis.base'),
              numeric: true,
              render: (item) => budgetCell(item, 'base')
            },
            {
              key: 'reserve',
              label: translate('kpis.reserve'),
              numeric: true,
              render: (item) => budgetCell(item, 'reserve')
            },
            {
              key: 'total',
              label: translate('budgetTotal'),
              numeric: true,
              render: (item) => budgetCell(item, 'total')
            },
            {
              key: 'committed',
              label: translate('budgetCommitted'),
              numeric: true,
              render: (item) => budgetCell(item, 'committed')
            },
            {
              key: 'spent',
              label: translate('kpis.spent'),
              numeric: true,
              render: (item) => budgetCell(item, 'spent')
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
