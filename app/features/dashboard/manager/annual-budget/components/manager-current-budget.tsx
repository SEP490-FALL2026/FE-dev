import { useTranslation } from 'react-i18next'
import { useBudgetMine } from '~/shared/api/generated/operations/budgets/budget-mine'
import { useBudgetMineLineList } from '~/shared/api/generated/operations/budgets/budget-mine-line-list'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import {
  ManagerMoney,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection,
  ManagerStatus
} from '../../shared/components/manager-api-ui'
import { BUDGET_STATUS } from '../enums/budget-status'

export function ManagerCurrentBudget({ year }: { year: number }) {
  const { t: translate } = useTranslation('manager')
  const query = useBudgetMine({ year })
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
          {budget.status === BUDGET_STATUS.ACTIVE && <CurrentLines year={year} />}
        </>
      )}
    </ManagerSection>
  )
}
function CurrentLines({ year }: { year: number }) {
  const paging = useManagerPage('budgetPage')
  const query = useBudgetMineLineList({ year, page: paging.page, pageSize: paging.pageSize })
  return (
    <div>
      <ManagerQueryState query={query} empty={!query.data?.data?.items.length} />
      {!query.isError &&
        query.data?.data?.items.map((line) => (
          <div key={line.position} className='flex flex-wrap justify-between gap-4 border-b border-border/40 py-3'>
            <p className='min-w-0 flex-1 truncate text-sm' title={line.description}>
              {line.position} · {line.description}
            </p>
            <ManagerMoney money={line.amount} />
          </div>
        ))}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </div>
  )
}
