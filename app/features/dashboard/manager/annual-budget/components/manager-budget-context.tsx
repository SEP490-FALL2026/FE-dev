import { useTranslation } from 'react-i18next'
import { useBudgetScope } from '../hooks/use-budget-scope'
import { useBudgetMine } from '~/shared/api/generated/operations/budgets/budget-mine'
import { useBudgetCycleBaseline } from '~/shared/api/generated/operations/budget-cycles/budget-cycle-baseline'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ManagerMoney, ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'

export function ManagerBudgetContext({ year, costCenterId }: { year: number; costCenterId?: string }) {
  const { t } = useTranslation('requestFlow')
  const scope = useBudgetScope()
  const departmentId = scope.departmentId
  const selectedCostCenter = costCenterId ?? scope.costCenterId
  const query = useBudgetMine(
    { year, ...(selectedCostCenter ? { costCenterId: selectedCostCenter } : {}) },
    { query: { enabled: !!costCenterId || (!scope.isPending && !scope.isError && !!departmentId) } }
  )
  const budget = !query.isError ? query.data?.data?.budget : null
  const baseline = useBudgetCycleBaseline(year, { departmentId }, { query: { enabled: !!departmentId } })
  const { formatDate, formatNumber } = useWorkspaceFormat()
  return (
    <ManagerSection title={t('ceiling')}>
      <ManagerQueryState query={query} />
      {budget && (
        <dl className='grid gap-4 text-sm sm:grid-cols-3'>
          <div>
            <dt className='text-xs text-muted-foreground'>{t('ceiling')}</dt>
            <dd>
              {budget.departmentCeiling ? <ManagerMoney money={budget.departmentCeiling.total} /> : t('notPublished')}
            </dd>
          </div>
          {budget.cycle && (
            <>
              <div>
                <dt className='text-xs text-muted-foreground'>{t('submissionDue')}</dt>
                <dd className='font-mono tabular-nums'>{formatDate(budget.cycle.submissionDeadline)}</dd>
              </div>
              <div>
                <dt className='text-xs text-muted-foreground'>{t('approvalDue')}</dt>
                <dd className='font-mono tabular-nums'>{formatDate(budget.cycle.decisionDeadline)}</dd>
              </div>
            </>
          )}
        </dl>
      )}
      {departmentId && (
        <details className='border-t border-border/60 pt-3'>
          <summary className='cursor-pointer text-sm font-medium'>{t('baseline')}</summary>
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
