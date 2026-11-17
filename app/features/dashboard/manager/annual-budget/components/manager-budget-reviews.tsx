import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useBudgetReviewPeriodList } from '~/shared/api/generated/operations/budget-review-periods/budget-review-period-list'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ManagerDataTable } from '../../shared/components/manager-data-table'
import { ManagerPagination, ManagerQueryState, ManagerSection } from '../../shared/components/manager-api-ui'
import { useManagerPage } from '../../shared/hooks/use-manager-page'
import { isResourceId } from '../../shared/manager-identifiers'
import { ManagerBudgetLabel } from './manager-budget-label'
import { ManagerBudgetReviewDetail } from './manager-budget-review-detail'
import { REVIEW_LIGHT } from '../enums/review-light'

export function ManagerBudgetReviews({ year, costCenterId }: { year: number; costCenterId: string }) {
  const { t } = useTranslation('manager')
  const { formatNumber } = useWorkspaceFormat()
  const [params, setParams] = useSearchParams()
  const paging = useManagerPage('reviewPage')
  const id = params.get('reviewId') ?? ''
  const query = useBudgetReviewPeriodList(
    { year, page: paging.page, pageSize: paging.pageSize },
    { query: { enabled: !isResourceId(id) } }
  )
  const periods = !query.isError ? (query.data?.data?.items ?? []).filter((period) => period.year === year) : []
  if (isResourceId(id))
    return (
      <ManagerBudgetReviewDetail
        key={`${id}:${year}:${costCenterId}`}
        id={id}
        year={year}
        costCenterId={costCenterId}
        onBack={() =>
          setParams((previous) => {
            const next = new URLSearchParams(previous)
            next.delete('reviewId')
            next.delete('reviewLinePage')
            return next
          })
        }
      />
    )
  return (
    <ManagerSection title={t('budgetWorkspace.views.reviews')} description={t('budgetWorkspace.reviewHint')}>
      <ManagerQueryState query={query} empty={!periods.length} />
      {!query.isError && (
        <ManagerDataTable
          label={t('budgetWorkspace.views.reviews')}
          items={periods}
          rowKey={(period) => period.id}
          columns={[
            {
              key: 'month',
              label: t('budgetWorkspace.month'),
              align: 'right',
              render: (period) =>
                t('budgetWorkspace.monthYear', { month: formatNumber(period.month), year: period.year })
            },
            {
              key: 'kind',
              label: t('budgetWorkspace.kind'),
              render: (period) => <ManagerBudgetLabel group='periodKinds' value={period.kind} />
            },
            {
              key: 'state',
              label: t('status'),
              render: (period) => <ManagerBudgetLabel group='periodStates' value={period.state} />
            },
            {
              key: 'lights',
              label: t('budgetWorkspace.light'),
              render: (period) => (
                <div className='flex flex-wrap gap-2'>
                  {Object.values(REVIEW_LIGHT).map((light) => (
                    <span key={light} className='inline-flex items-center gap-1'>
                      <ManagerBudgetLabel group='lights' value={light} />
                      <span className='font-mono text-xs tabular-nums'>{formatNumber(period.lightCounts[light])}</span>
                    </span>
                  ))}
                </div>
              )
            }
          ]}
          onOpen={(period) =>
            setParams((previous) => {
              const next = new URLSearchParams(previous)
              next.set('reviewId', period.id)
              next.delete('reviewLinePage')
              return next
            })
          }
        />
      )}
      <ManagerPagination pagination={query.data?.data?.pagination} onPage={paging.onPage} busy={query.isFetching} />
    </ManagerSection>
  )
}
