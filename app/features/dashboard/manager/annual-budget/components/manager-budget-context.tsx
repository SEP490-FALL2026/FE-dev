import { useTranslation } from 'react-i18next'
import { useBudgetCycleBaseline } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-baseline'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ManagerMoney, ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'
import type { BudgetContextState } from '../hooks/use-budget-context'
import { isCycleStatus } from '../enums/cycle-status'

/** Cycle of the year (status and deadlines), effective budget and the baseline used to prepare BM-10. */
export function ManagerBudgetContext({ year, context }: { year: number; context: BudgetContextState }) {
  const { t: translate } = useTranslation('requestFlow')
  const { query, budget, departmentId } = context
  const baseline = useBudgetCycleBaseline(year, { departmentId }, { query: { enabled: !!departmentId } })
  const { formatDate, formatNumber } = useWorkspaceFormat()
  const cycle = budget?.cycle
  return (
    <ManagerSection title={translate('budgetCycle')}>
      <ManagerQueryState query={query} />
      {budget && (
        <dl className='grid gap-4 text-sm sm:grid-cols-4'>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('budgetCycle')}</dt>
            <dd>
              {cycle
                ? isCycleStatus(cycle.status)
                  ? translate(`cycleStatus.${cycle.status}`)
                  : translate('unknown')
                : translate('noCycle')}
            </dd>
          </div>
          {cycle && (
            <>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('submissionDue')}</dt>
                <dd className='font-mono tabular-nums'>{formatDate(cycle.submissionDeadline)}</dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('approvalDue')}</dt>
                <dd className='font-mono tabular-nums'>{formatDate(cycle.decisionDeadline)}</dd>
              </div>
            </>
          )}
          {budget.effectiveBudget && (
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('effectiveBudget')}</dt>
              <dd className='font-mono tabular-nums'>
                <ManagerMoney money={budget.effectiveBudget.total} />
              </dd>
            </div>
          )}
        </dl>
      )}
      {budget && !context.cycleOpen && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('cycleClosedHint')}
        </p>
      )}
      {departmentId && (
        <details className='border-t border-border/60 pt-3'>
          <summary className='cursor-pointer text-sm font-medium'>{translate('baseline')}</summary>
          <ManagerQueryState query={baseline} />
          {!baseline.isError &&
            baseline.data?.data?.departments.map((department) => (
              <div key={department.departmentId} className='space-y-3 py-3'>
                <p className='text-sm'>{department.departmentName}</p>
                {department.software.map((software) => (
                  <div
                    key={software.subscriptionId}
                    className='flex flex-wrap justify-between gap-3 border-b border-border/40 py-2 text-sm'
                  >
                    <span className='min-w-0 flex-1 truncate' title={`${software.application} · ${software.plan}`}>
                      {software.application} · {software.plan}
                    </span>
                    <span className='font-mono tabular-nums'>{formatNumber(software.seatsAssigned)}</span>
                    <ManagerMoney money={software.estimatedAnnualCost} />
                  </div>
                ))}
              </div>
            ))}
        </details>
      )}
    </ManagerSection>
  )
}
