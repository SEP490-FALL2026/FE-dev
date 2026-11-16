import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBudgetReviewPeriodGet } from '~/shared/api/generated/operations/budget-review-periods/budget-review-period-get'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import {
  ManagerButton,
  ManagerMoney,
  ManagerPagination,
  ManagerQueryState,
  ManagerSection
} from '../../shared/components/manager-api-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { REVIEW_PERIOD_STATE } from '../enums/review-period-state'
import { REVIEW_PERIOD_KIND } from '../enums/review-period-kind'
import { REVIEW_LIGHT } from '../enums/review-light'
import { EXPLANATION_STATUS } from '../enums/explanation-status'
import { ManagerBudgetLabel } from './manager-budget-label'
import { ManagerBudgetExplanation } from './manager-budget-explanation'

export function ManagerBudgetReviewDetail({
  id,
  year,
  costCenterId,
  onBack
}: {
  id: string
  year: number
  costCenterId: string
  onBack: () => void
}) {
  const { t } = useTranslation('manager')
  const { formatDate, formatDateTime, formatPercent, formatNumber } = useWorkspaceFormat()
  const paging = useManagerPage('reviewLinePage')
  const query = useBudgetReviewPeriodGet(id, { page: paging.page, pageSize: paging.pageSize })
  const response = !query.isError ? query.data?.data : null
  const data = response?.period.id === id && response.period.year === year ? response : null
  const lines = data?.items.filter((line) => line.costCenter?.id === costCenterId) ?? []
  const [editing, setEditing] = useState<string | null>(null)
  return (
    <div className='space-y-5'>
      <ManagerButton onClick={onBack}>{t('back')}</ManagerButton>
      <ManagerSection title={t('budgetWorkspace.reviewDetail')}>
        <ManagerQueryState query={query} empty={!data || !lines.length} emptyTitle={t('budgetWorkspace.unavailable')} />
        {data && lines.length > 0 && (
          <>
            <div className='flex flex-wrap items-center justify-between gap-3 text-sm'>
              <p className='font-mono tabular-nums'>
                {t('budgetWorkspace.monthYear', { month: formatNumber(data.period.month), year: data.period.year })}
              </p>
              <div className='flex gap-2'>
                <ManagerBudgetLabel group='periodKinds' value={data.period.kind} />
                <ManagerBudgetLabel group='periodStates' value={data.period.state} />
              </div>
            </div>
            <dl className='grid gap-4 text-sm sm:grid-cols-3'>
              <div>
                <dt className='text-muted-foreground'>{t('budgetWorkspace.closedAt')}</dt>
                <dd className='mt-1 text-right font-mono tabular-nums'>{formatDateTime(data.period.closedAt)}</dd>
              </div>
              {data.period.explanationsDueOn && (
                <div>
                  <dt className='text-muted-foreground'>{t('budgetWorkspace.dueOn')}</dt>
                  <dd className='mt-1 text-right font-mono tabular-nums'>
                    {formatDate(data.period.explanationsDueOn)}
                  </dd>
                </div>
              )}
              {data.period.signedAt && (
                <div>
                  <dt className='text-muted-foreground'>{t('budgetWorkspace.signedAt')}</dt>
                  <dd className='mt-1 text-right font-mono tabular-nums'>{formatDateTime(data.period.signedAt)}</dd>
                </div>
              )}
            </dl>
            <p className='text-xs text-muted-foreground'>{t('budgetWorkspace.snapshotHint')}</p>
          </>
        )}
        {data &&
          lines.map((line) => {
            const editable =
              data.period.kind === REVIEW_PERIOD_KIND.QUARTER &&
              data.period.state === REVIEW_PERIOD_STATE.AWAITING_EXPLANATIONS &&
              [REVIEW_LIGHT.YELLOW, REVIEW_LIGHT.RED, REVIEW_LIGHT.UNDER].some((value) => value === line.light) &&
              (line.explanationStatus === EXPLANATION_STATUS.PENDING ||
                line.explanationStatus === EXPLANATION_STATUS.EXPLAINED)
            return (
              <section
                key={line.id}
                className='space-y-5 border-t border-border/60 pt-5'
                aria-label={line.costCenter?.name}
              >
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <h3 className='min-w-0 truncate text-sm font-semibold' title={line.costCenter?.name}>
                    {line.costCenter?.name}
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    <ManagerBudgetLabel group='lights' value={line.light} />
                    <ManagerBudgetLabel group='explanationStates' value={line.explanationStatus} />
                  </div>
                </div>
                <dl className='grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 xl:grid-cols-3'>
                  {(
                    [
                      'base',
                      'reserve',
                      'spent',
                      'spentAfterMonth',
                      'changedAfterSnapshot',
                      'committed',
                      'pendingSpend',
                      'remaining',
                      'forecast',
                      'priceIncrease'
                    ] as const
                  ).map((key) => (
                    <div key={key}>
                      <dt className='text-muted-foreground'>{t(`budgetWorkspace.figures.${key}`)}</dt>
                      <dd className='mt-1 text-right font-mono tabular-nums'>
                        <ManagerMoney money={line[key]} />
                      </dd>
                    </div>
                  ))}
                  <div>
                    <dt className='text-muted-foreground'>{t('budgetWorkspace.pace')}</dt>
                    <dd className='mt-1 text-right font-mono tabular-nums'>
                      {line.paceBasisPoints === null ? t('notReported') : formatPercent(line.paceBasisPoints / 10000)}
                    </dd>
                  </div>
                </dl>
                {line.explanation && (
                  <div className='space-y-4 border-t border-border/40 pt-4'>
                    <h4 className='text-sm font-semibold'>{t('budgetWorkspace.explanation')}</h4>
                    <dl className='grid gap-4 text-sm sm:grid-cols-2'>
                      {(['cause', 'action'] as const).map((key) => (
                        <div key={key}>
                          <dt className='text-muted-foreground'>{t(`budgetWorkspace.${key}`)}</dt>
                          <dd className='mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]'>
                            {line.explanation?.[key]}
                          </dd>
                        </div>
                      ))}
                      <div>
                        <dt className='text-muted-foreground'>{t('budgetWorkspace.persistenceLabel')}</dt>
                        <dd className='mt-1'>
                          <ManagerBudgetLabel group='persistence' value={line.explanation.persistence} />
                        </dd>
                      </div>
                      <div>
                        <dt className='text-muted-foreground'>{t('budgetWorkspace.knownAmount')}</dt>
                        <dd className='mt-1 text-right font-mono tabular-nums'>
                          <ManagerMoney money={line.explanation.knownNeedsToYearEnd.amount} />
                        </dd>
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-muted-foreground'>{t('budgetWorkspace.knownNote')}</dt>
                        <dd className='mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]'>
                          {line.explanation.knownNeedsToYearEnd.note}
                        </dd>
                      </div>
                    </dl>
                    <p className='text-right font-mono text-xs text-muted-foreground tabular-nums'>
                      {formatDateTime(line.explanation.explainedAt)}
                    </p>
                  </div>
                )}
                {editable && (
                  <ManagerButton primary disabled={query.isFetching} onClick={() => setEditing(line.id)}>
                    {t(line.explanation ? 'budgetWorkspace.editExplanation' : 'budgetWorkspace.explain')}
                  </ManagerButton>
                )}
                {editable && editing === line.id && (
                  <ManagerBudgetExplanation
                    key={line.id}
                    periodId={id}
                    costCenterId={costCenterId}
                    line={line}
                    disabled={query.isFetching}
                    onClose={() => setEditing(null)}
                  />
                )}
              </section>
            )
          })}
        {data && <ManagerPagination pagination={data.pagination} onPage={paging.onPage} busy={query.isFetching} />}
      </ManagerSection>
    </div>
  )
}
