import { useTranslation } from 'react-i18next'
import { useBudgetScope } from '../hooks/use-budget-scope'
import { useBudgetMine } from '~/shared/api/generated/operations/budgets/budget-mine'
import { ManagerMoney, ManagerQueryState, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'

export function ManagerCurrentBudget({ year }: { year: number }) {
  const { t: translate } = useTranslation('manager')
  const scope = useBudgetScope()
  const query = useBudgetMine(
    { year, ...(scope.costCenterId ? { costCenterId: scope.costCenterId } : {}) },
    { query: { enabled: !scope.isPending && !scope.isError && !!scope.departmentId } }
  )
  const budget = !query.isError ? query.data?.data?.budget : null
  return (
    <ManagerSection title={translate('currentBudget')}>
      <ManagerQueryState query={query} empty={!budget} emptyTitle={translate('budgetMissing')} />
      {budget && (
        <>
          <div className='flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface-subtle p-4'>
            <ManagerStatus value={budget.status} />
            <div className='text-right'>
              <p className='mb-1 text-xs text-muted-foreground'>{translate('total')}</p>
              <p className='text-xl font-semibold tracking-tight'>
                <ManagerMoney money={budget.total} />
              </p>
            </div>
          </div>
        </>
      )}
    </ManagerSection>
  )
}
