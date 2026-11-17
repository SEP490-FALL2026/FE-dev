import { useTranslation } from 'react-i18next'
import { ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'
import { isResourceId } from '../../shared/manager-identifiers'
import type { BudgetView } from '../budget-navigation'
import type { useBudgetScope } from '../hooks/use-budget-scope'
import { ManagerBudgetReviews } from '../components/manager-budget-reviews'
import { ManagerSeatMonthCharges } from '../components/manager-seat-month-charges'
import { ManagerBudgetAdjustments } from '../components/manager-budget-adjustments'

export function ManagerInYearBudget({
  year,
  view,
  scope
}: {
  year: number
  view: BudgetView
  scope: ReturnType<typeof useBudgetScope>
}) {
  const { t } = useTranslation('manager')
  if (scope.isPending || scope.isError) return <ManagerQueryState query={scope.query} />
  if (!scope.isCurrent || !isResourceId(scope.costCenterId ?? ''))
    return (
      <ManagerSection title={t('budgetWorkspace.navigation')}>
        <p className='text-sm text-muted-foreground'>
          {t(scope.isCurrent ? 'overviewBudget.noCostCenter' : 'budgetWorkspace.currentOnly')}
        </p>
      </ManagerSection>
    )
  const costCenterId = scope.costCenterId
  if (!costCenterId) return null
  if (view === 'reviews') return <ManagerBudgetReviews year={year} costCenterId={costCenterId} />
  if (view === 'charges') return <ManagerSeatMonthCharges year={year} costCenterId={costCenterId} />
  return <ManagerBudgetAdjustments year={year} costCenterId={costCenterId} />
}
