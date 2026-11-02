import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFinanceReviewGet } from '~/shared/api/generated/operations/finance-reviews/finance-review-get'
import { useBudgetCheckGet } from '~/shared/api/generated/operations/finance-reviews/budget-check-get'
import { useBudgetCheckYearList } from '~/shared/api/generated/operations/finance-reviews/budget-check-year-list'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useAccessRequestGet } from '~/shared/api/generated/operations/access-requests/access-request-get'
import {
  FinanceDrawer,
  FinanceEmpty,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney } from '../../shared/finance-money'
import { RecordedReviewOutcome } from '../enums/recorded-review-outcome'
import { ReviewState } from '../enums/review-state'
import { WaitingBudgetState } from '../enums/waiting-budget-state'
import { FinanceReviewForm } from './finance-review-form'

export function FinanceReviewDetail({ requestId, onClose }: { requestId: string; onClose: () => void }) {
  const { t: translate, i18n } = useTranslation('financeSpend')
  const [yearPage, setYearPage] = useState(1)
  const [pending, setPending] = useState(false)
  const detail = useFinanceReviewGet(requestId)
  const check = useBudgetCheckGet(requestId)
  const years = useBudgetCheckYearList(requestId, { page: yearPage, pageSize: 20 })
  const me = useMeGet()
  const review = detail.data?.data?.financeReview
  const canLookupWaiting =
    review?.step.state === ReviewState.COMPLETED &&
    review.review?.outcome === RecordedReviewOutcome.BUDGET_REVISION_NEEDED
  const request = useAccessRequestGet(requestId, {
    query: {
      enabled: canLookupWaiting
    }
  })
  const requestData = request.data?.data
  const requestItem = requestData && 'request' in requestData ? requestData.request : undefined
  const waitingBudget = canLookupWaiting && requestItem?.state === WaitingBudgetState
  const employeeId = me.data?.data?.employee?.id
  const ownRequest =
    requestItem?.requester.employeeId === employeeId || requestItem?.beneficiary?.employeeId === employeeId
  const authorized = Boolean(
    me.data?.data?.roles.effective.includes('FINANCE') &&
    employeeId &&
    review?.step.assignee?.employeeId === employeeId &&
    !ownRequest
  )
  const actionable =
    authorized &&
    (review?.step.state === ReviewState.PENDING || (review?.step.state === ReviewState.COMPLETED && waitingBudget))
  const fresh =
    Boolean(check.data?.data?.budgetCheck && years.data?.data) &&
    !detail.isFetching &&
    !detail.isError &&
    !me.isFetching &&
    !me.isError &&
    !check.isFetching &&
    !check.isError &&
    !years.isFetching &&
    !years.isError &&
    (!waitingBudget || (!request.isFetching && !request.isError))
  const latestCheck = check.data?.data?.budgetCheck
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('common.unavailable')
  return (
    <FinanceDrawer title={translate('review.detail')} onClose={onClose} pending={pending}>
      <p className='break-all font-mono text-sm'>{requestId}</p>
      <FinanceQueryState query={detail}>
        {!review ? (
          <FinanceEmpty />
        ) : (
          <>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div>
                <span className='text-sm text-muted-foreground'>{translate('common.state')}</span>
                <FinanceStatus value={review.step.state} />
              </div>
              <div>
                <span className='text-sm text-muted-foreground'>{translate('review.assignee')}</span>
                <p>{review.step.assignee?.fullName ?? translate('common.unavailable')}</p>
              </div>
              {review.step.waitingReason && <FinanceStatus value={review.step.waitingReason} />}
              {review.review && (
                <div>
                  <FinanceStatus value={review.review.outcome} />
                  <FinanceStatus value={review.review.direction} />
                  <p className='whitespace-pre-wrap'>{review.review.opinion ?? review.review.reason}</p>
                </div>
              )}
            </div>
            <FinanceQueryState query={check}>
              {latestCheck ? (
                <dl className='grid gap-3 sm:grid-cols-2'>
                  <div>
                    <dt className='text-sm text-muted-foreground'>{translate('review.checkCode')}</dt>
                    <dd>
                      <FinanceStatus value={latestCheck.primaryCode} />
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>{translate('review.route')}</dt>
                    <dd>
                      <FinanceStatus value={latestCheck.route} />
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>{translate('review.bindingTotal')}</dt>
                    <dd className='font-mono tabular-nums'>{money(latestCheck.bindingTotal)}</dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>{translate('review.offPlan')}</dt>
                    <dd>{translate(latestCheck.offPlan ? 'common.yes' : 'common.no')}</dd>
                  </div>
                </dl>
              ) : (
                <FinanceEmpty />
              )}
            </FinanceQueryState>
            <section aria-label={translate('review.years')} className='space-y-3'>
              <h3 className='font-semibold [text-wrap:balance]'>{translate('review.years')}</h3>
              <FinanceQueryState query={years}>
                <FinanceTable
                  items={years.data?.data?.items ?? []}
                  rowKey={(item) => String(item.year)}
                  columns={[
                    { key: 'year', label: translate('common.year'), numeric: true, render: (item) => item.year },
                    {
                      key: 'cost',
                      label: translate('review.yearCost'),
                      numeric: true,
                      render: (item) => money(item.cost)
                    },
                    {
                      key: 'budget',
                      label: translate('review.budget'),
                      numeric: true,
                      render: (item) => money(item.budget)
                    },
                    {
                      key: 'held',
                      label: translate('commitments.held'),
                      numeric: true,
                      render: (item) => money(item.held)
                    },
                    {
                      key: 'spent',
                      label: translate('review.spent'),
                      numeric: true,
                      render: (item) => money(item.spent)
                    },
                    {
                      key: 'remaining',
                      label: translate('review.remaining'),
                      numeric: true,
                      render: (item) => money(item.remaining)
                    },
                    {
                      key: 'pending',
                      label: translate('review.pending'),
                      numeric: true,
                      render: (item) => money(item.pending)
                    },
                    {
                      key: 'code',
                      label: translate('review.checkCode'),
                      render: (item) => <FinanceStatus value={item.code} />
                    }
                  ]}
                />
                <FinancePagination pagination={years.data?.data?.pagination} onPageChange={setYearPage} />
              </FinanceQueryState>
            </section>
            {request.isEnabled && (
              <FinanceQueryState query={request}>
                {waitingBudget && <p className='text-sm text-muted-foreground'>{translate('review.waitingBudget')}</p>}
              </FinanceQueryState>
            )}
          </>
        )}
      </FinanceQueryState>
      <FinanceQueryState query={me}>
        <span />
      </FinanceQueryState>
      {review && (
        <FinanceReviewForm
          requestId={requestId}
          disabled={!actionable || !fresh}
          waitingBudget={waitingBudget}
          blocked={Boolean(latestCheck?.periodClosed || latestCheck?.staleCostEvidence)}
          onPendingChange={setPending}
        />
      )}
    </FinanceDrawer>
  )
}
