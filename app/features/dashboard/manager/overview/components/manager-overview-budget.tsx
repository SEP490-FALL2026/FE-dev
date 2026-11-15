import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDepartmentGet } from '~/shared/api/generated/operations/departments/department-get'
import { useBudgetMine } from '~/shared/api/generated/operations/budgets/budget-mine'
import { MineResponseDtoDataBudgetStatus } from '~/shared/api/generated/model/budgets/mineResponseDtoDataBudgetStatus'
import { isResourceId } from '../../shared/manager-identifiers'
import { ManagerMoney, ManagerQueryState, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'
import { ManagerBudgetChart } from './manager-budget-chart'

export function ManagerOverviewBudget() {
  const { t } = useTranslation('manager')
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
    <ManagerSection title={t('overviewBudget.title')} description={t('overviewBudget.description', { year })}>
      {me.isPending || me.isError ? (
        <ManagerQueryState query={me} syncPermissions={false} />
      ) : !isResourceId(departmentId) ? (
        <p className='text-sm text-muted-foreground'>{t('overviewBudget.noDepartment')}</p>
      ) : department.isPending || department.isError ? (
        <ManagerQueryState query={department} />
      ) : !ownDepartment || !isResourceId(costCenterId) ? (
        <p className='text-sm text-muted-foreground'>{t('overviewBudget.noCostCenter')}</p>
      ) : budgetQuery.isPending || budgetQuery.isError ? (
        <ManagerQueryState query={budgetQuery} />
      ) : !budget || !matchesScope ? (
        <p className='text-sm text-muted-foreground'>{t('overviewBudget.unavailable')}</p>
      ) : (
        <div className='space-y-6'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='min-w-0 space-y-1'>
              <p className='break-words text-sm font-medium'>{ownDepartment.name}</p>
              <p className='break-words text-sm text-muted-foreground'>
                {t('overviewBudget.costCenter', { code: budget.costCenter.code, name: budget.costCenter.name })}
              </p>
            </div>
            <ManagerStatus value={budget.status} />
          </div>
          {budget.status === MineResponseDtoDataBudgetStatus.NO_ACTIVE_BUDGET ? (
            <p className='text-sm text-muted-foreground'>{t('overviewBudget.noBudget')}</p>
          ) : budget.status !== MineResponseDtoDataBudgetStatus.ACTIVE || !budget.total ? (
            <p className='text-sm text-muted-foreground'>{t('overviewBudget.unavailable')}</p>
          ) : (
            <>
              <div className='border-y border-border/60 py-4'>
                <p className='text-sm text-muted-foreground'>{t('overviewBudget.allocated')}</p>
                <p className='mt-1 break-all text-2xl font-semibold tracking-tight'>
                  <ManagerMoney money={budget.total} />
                </p>
              </div>
              <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
                <ManagerBudgetChart
                  title={t('overviewBudget.structure')}
                  rows={[
                    { label: t('overviewBudget.base'), money: budget.base, accent: true },
                    { label: t('overviewBudget.reserve'), money: budget.reserve }
                  ]}
                />
                <ManagerBudgetChart
                  title={t('overviewBudget.usage')}
                  rows={[
                    { label: t('overviewBudget.spent'), money: budget.spent, accent: true },
                    { label: t('overviewBudget.committed'), money: budget.committed },
                    { label: t('overviewBudget.pending'), money: budget.pendingSpend },
                    { label: t('overviewBudget.remaining'), money: budget.remainingWithReserve }
                  ]}
                />
              </div>
            </>
          )}
        </div>
      )}
    </ManagerSection>
  )
}
