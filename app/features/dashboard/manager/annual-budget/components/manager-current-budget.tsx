import { useTranslation } from 'react-i18next'
import { useBudgetContext } from '../hooks/use-budget-context'
import { ManagerMoney, ManagerQueryState, ManagerSection, ManagerStatus } from '../../shared/components/manager-api-ui'

export function ManagerCurrentBudget({ year }: { year: number }) {
  const { t: translate } = useTranslation('manager')
  const { query, budget } = useBudgetContext(year)
  return (
    <ManagerSection title={translate('currentBudget')}>
      <ManagerQueryState query={query} empty={!budget} emptyTitle={translate('budgetMissing')} />
      {budget && (
        <>
          <div className='flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface-subtle p-4'>
            <ManagerStatus value={budget.status} />
            <div className='text-right'>
              <p className='mb-1 text-xs text-muted-foreground'>{translate('overviewBudget.effective')}</p>
              <p className='text-xl font-semibold tracking-tight'>
                <ManagerMoney money={budget.effectiveBudget?.total} />
              </p>
            </div>
          </div>
        </>
      )}
    </ManagerSection>
  )
}
