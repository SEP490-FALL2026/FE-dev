import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { useBudgetMine } from '~/shared/api/generated/operations/budgets/budget-mine'
import { MineResponseDtoDataBudgetStatus } from '~/shared/api/generated/model/budgets/mineResponseDtoDataBudgetStatus'
import { isResourceId } from '../../shared/manager-identifiers'
import { ManagerMoney, ManagerQueryState, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'
import { ManagerBudgetComposition, ManagerBudgetUsage } from './manager-budget-chart'

export function ManagerOverviewBudget() {
  const { t: translate } = useTranslation('manager')
  const year = new Date().getFullYear()
  const me = useMeGet()
  const departmentId = !me.isError ? (me.data?.data?.managerScope?.departmentId ?? '') : ''
  const department = useDepartmentGet(departmentId, { query: { enabled: isResourceId(departmentId) } })
  const ownDepartment = !department.isError && department.data?.data?.id === departmentId ? department.data.data : null
  const costCenterId = ownDepartment?.costCenter?.id ?? ''
  const budgetQuery = useBudgetMine(
    { year, costCenterId },
    { query: { enabled: isResourceId(departmentId) && isResourceId(costCenterId) } }
  )
  const budget = !budgetQuery.isError ? budgetQuery.data?.data?.budget : null
  const matchesScope = budget?.costCenter?.id === costCenterId && budget.year === year

  return (
    <ManagerSection
      title={translate('overviewBudget.title')}
      description={translate('overviewBudget.description', { year })}
    >
      {me.isPending || me.isError ? (
        <ManagerQueryState query={me} syncPermissions={false} />
      ) : !isResourceId(departmentId) ? (
        <p className='text-sm text-muted-foreground'>{translate('overviewBudget.noDepartment')}</p>
      ) : department.isPending || department.isError ? (
        <ManagerQueryState query={department} />
      ) : !ownDepartment || !isResourceId(costCenterId) ? (
        <p className='text-sm text-muted-foreground'>{translate('overviewBudget.noCostCenter')}</p>
      ) : budgetQuery.isPending || budgetQuery.isError ? (
        <ManagerQueryState query={budgetQuery} />
      ) : !budget || !matchesScope ? (
        <p className='text-sm text-muted-foreground'>{translate('overviewBudget.unavailable')}</p>
      ) : (
        <div className='space-y-6'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='min-w-0 space-y-1'>
              <p className='break-words text-sm font-medium'>{ownDepartment.name}</p>
              <p className='break-words text-sm text-muted-foreground'>
                {translate('overviewBudget.costCenter', { code: budget.costCenter.code, name: budget.costCenter.name })}
              </p>
            </div>
            <ManagerStatus value={budget.status} />
          </div>
          {budget.status === MineResponseDtoDataBudgetStatus.NO_ACTIVE_BUDGET ? (
            <p className='text-sm text-muted-foreground'>{translate('overviewBudget.noBudget')}</p>
          ) : budget.status !== MineResponseDtoDataBudgetStatus.ACTIVE || !budget.effectiveBudget ? (
            <p className='text-sm text-muted-foreground'>{translate('overviewBudget.unavailable')}</p>
          ) : (
            <>
              <div className='grid items-end gap-5 border-y border-border/60 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]'>
                <div className='min-w-0 text-right'>
                  <p className='text-sm text-muted-foreground'>{translate('overviewBudget.effective')}</p>
                  <p className='mt-1 break-all text-right font-mono text-2xl font-semibold tabular-nums tracking-tight'>
                    <ManagerMoney money={budget.effectiveBudget.total} />
                  </p>
                </div>
                <dl className='grid gap-4 text-sm sm:grid-cols-2'>
                  <div>
                    <dt className='text-right text-muted-foreground'>{translate('overviewBudget.allocated')}</dt>
                    <dd className='mt-1 text-right font-mono tabular-nums'>
                      <ManagerMoney money={budget.total} />
                    </dd>
                  </div>
                  <div>
                    <dt className='text-right text-muted-foreground'>{translate('overviewBudget.adjustment')}</dt>
                    <dd className='mt-1 text-right font-mono tabular-nums'>
                      <ManagerMoney money={budget.effectiveBudget.adjustment} />
                    </dd>
                  </div>
                </dl>
              </div>
              <ManagerBudgetUsage
                total={budget.effectiveBudget.total}
                spent={budget.spent}
                committed={budget.committed}
                pending={budget.pendingSpend}
                remaining={budget.remainingWithReserve}
                overBudget={budget.overBudget}
              />
              <ManagerBudgetComposition
                total={budget.effectiveBudget.total}
                base={budget.effectiveBudget.base}
                reserve={budget.effectiveBudget.reserve}
              />
            </>
          )}
        </div>
      )}
    </ManagerSection>
  )
}
