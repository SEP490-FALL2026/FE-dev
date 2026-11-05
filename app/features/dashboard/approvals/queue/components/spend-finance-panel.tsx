import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useFinanceReviewGet } from '~/shared/api/generated/operations/finance-reviews/finance-review-get'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import { ApprovalsSection, ApprovalsStatus } from '../../shared/components/approvals-ui'

/** Finance's review of the request, read-only for the approver. */
export function SpendFinancePanel({ requestId }: { requestId: string }) {
  const { t: translate } = useTranslation('approvalsSpend')
  const review = useFinanceReviewGet(requestId, { query: { retry: false } })
  const reviewNotFound = isAxiosError(review.error) && review.error.response?.status === 404
  const finance = review.data?.data?.financeReview
  return (
    <ApprovalsSection title={translate('finance')}>
      {reviewNotFound ? (
        <p className='text-sm text-muted-foreground'>{translate('noFinance')}</p>
      ) : (
        <ApprovalsQueryState query={review}>
          {finance ? (
            <div className='space-y-3 rounded-lg border border-border/70 bg-surface p-4'>
              <ApprovalsStatus value={finance.step.state} />
              {finance.review && (
                <dl className='space-y-3'>
                  <div>
                    <dt className='text-xs text-muted-foreground'>{translate('outcome')}</dt>
                    <dd>
                      <ApprovalsStatus value={finance.review.outcome} />
                    </dd>
                  </div>
                  <div>
                    <dt className='text-xs text-muted-foreground'>{translate('direction')}</dt>
                    <dd>
                      <ApprovalsStatus value={finance.review.direction} />
                    </dd>
                  </div>
                  <div>
                    <dt className='text-xs text-muted-foreground'>{translate('opinion')}</dt>
                    <dd className='text-sm whitespace-pre-wrap'>
                      {finance.review.opinion ?? translate('unavailable')}
                    </dd>
                  </div>
                  {finance.review.reason && <p className='text-sm whitespace-pre-wrap'>{finance.review.reason}</p>}
                </dl>
              )}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>{translate('noFinance')}</p>
          )}
        </ApprovalsQueryState>
      )}
    </ApprovalsSection>
  )
}
