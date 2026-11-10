import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type CostCenterPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/cost-centers'
import type { FinanceTabKey } from '../../enums'
import {
  FinanceDrawer,
  FinanceEmpty,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { BudgetUtilization } from '../../shared/components/budget-utilization'
import { hasBudget } from '../../shared/finance-budget-row'
import { formatMoney } from '../../shared/finance-money'
import { useCurrentBudgetsByCostCenter } from '../hooks/use-cost-center-budgets'
import { CostCenterBudgetVersions } from './cost-center-budget-versions'
import { CostCenterCommitments } from './cost-center-commitments'

/** Read-only view of one cost center: its current budget figures, commitments/payment batches, and versions. */
export function CostCenterDetail({
  item,
  year,
  onClose,
  onSelectTab
}: {
  item: CostCenterPageResponseDtoDataItemsItem
  year: number | undefined
  onClose: () => void
  onSelectTab?: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const budgets = useCurrentBudgetsByCostCenter(year)
  const budget = budgets.data?.byCostCenter.get(item.id)

  const currentBudget = budget && hasBudget(budget) ? budget : undefined

  return (
    <FinanceDrawer title={`${item.code} · ${item.name}`} onClose={onClose}>
      <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3'>
        <p className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
          <span className='font-medium text-foreground'>{item.department?.name ?? translate('noDepartment')}</span>
          <FinanceStatus value={item.status} />
        </p>
        <span className='font-mono text-xs text-muted-foreground'>{translate('budgetOfYear', { year: year ?? '—' })}</span>
      </div>

      <FinanceSection title={translate('budgetOfYear', { year: year ?? '—' })}>
        <FinanceQueryState query={budgets}>
          {currentBudget ? (
            <div className='space-y-4'>
              <FinanceStatGrid columns={4}>
                <FinanceStat label={translate('kpis.total')} value={formatMoney(currentBudget.total, i18n.language)} />
                <FinanceStat label={translate('kpis.base')} value={formatMoney(currentBudget.base, i18n.language)} />
                <FinanceStat label={translate('kpis.reserve')} value={formatMoney(currentBudget.reserve, i18n.language)} />
                <FinanceStat label={translate('kpis.held')} value={formatMoney(currentBudget.committed, i18n.language)} />
              </FinanceStatGrid>

              <FinanceStatGrid columns={3}>
                <FinanceStat label={translate('kpis.spent')} value={formatMoney(currentBudget.spent, i18n.language)} />
                <FinanceStat
                  emphasis
                  label={translate('kpis.remaining')}
                  value={formatMoney(currentBudget.remaining, i18n.language)}
                />
                <div className='min-w-0 space-y-2 rounded-lg border border-border/70 bg-surface p-4'>
                  <dt className='text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
                    {translate('budgetUtilization')}
                  </dt>
                  <dd className='font-mono text-lg font-bold tabular-nums'>
                    <BudgetUtilization
                      total={currentBudget.total}
                      committed={currentBudget.committed}
                      spent={currentBudget.spent}
                      overCommitted={currentBudget.overCommitted}
                    />
                  </dd>
                </div>
              </FinanceStatGrid>
            </div>
          ) : (
            <FinanceEmpty message={translate('noBudgetForYear', { year: year ?? '—' })} />
          )}
        </FinanceQueryState>
      </FinanceSection>

      <CostCenterCommitments costCenterId={item.id} year={year} />

      <CostCenterBudgetVersions costCenterId={item.id} onSelectTab={onSelectTab} />
    </FinanceDrawer>
  )
}
