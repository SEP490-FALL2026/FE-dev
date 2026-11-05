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
import { formatMoney } from '../../shared/finance-money'
import { useCurrentBudgetsByCostCenter } from '../hooks/use-cost-center-budgets'
import { CostCenterBudgetVersions } from './cost-center-budget-versions'

/** Read-only view of one cost center: its current budget for the chosen year and every budget version. */
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
  return (
    <FinanceDrawer title={`${item.code} · ${item.name}`} onClose={onClose}>
      <p className='flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        <span>{item.department?.name ?? translate('noDepartment')}</span>
        <FinanceStatus value={item.status} />
      </p>
      <FinanceSection title={translate('budgetOfYear', { year: year ?? '—' })}>
        <FinanceQueryState query={budgets}>
          {budget ? (
            <FinanceStatGrid columns={4}>
              <FinanceStat label={translate('budgetTotal')} value={formatMoney(budget.total, i18n.language)} />
              <FinanceStat label={translate('budgetCommitted')} value={formatMoney(budget.committed, i18n.language)} />
              <FinanceStat
                emphasis
                label={translate('budgetRemaining')}
                value={formatMoney(budget.remaining, i18n.language)}
              />
              <div className='min-w-0 space-y-2 bg-surface p-4'>
                <dt className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                  {translate('budgetUtilization')}
                </dt>
                <dd className='font-mono text-lg font-semibold tabular-nums'>
                  <BudgetUtilization
                    total={budget.total}
                    committed={budget.committed}
                    overCommitted={budget.overCommitted}
                  />
                </dd>
              </div>
            </FinanceStatGrid>
          ) : (
            <FinanceEmpty message={translate('noBudgetForYear', { year: year ?? '—' })} />
          )}
        </FinanceQueryState>
      </FinanceSection>
      <CostCenterBudgetVersions costCenterId={item.id} onSelectTab={onSelectTab} />
    </FinanceDrawer>
  )
}
