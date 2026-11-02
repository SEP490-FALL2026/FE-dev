import { isAxiosError } from 'axios'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFinanceReviewGet } from '~/shared/api/generated/operations/finance-reviews/finance-review-get'
import { useBudgetInformationAsk } from '~/shared/api/generated/operations/budget-information/budget-information-ask'
import {
  useBudgetInformationOfRequest,
  getBudgetInformationOfRequestQueryKey
} from '~/shared/api/generated/operations/budget-information/budget-information-of-request'
import { getSpendApprovalGetQueryKey } from '~/shared/api/generated/operations/spend-approvals/spend-approval-get'
import { useApprovalsFeedback } from '../../shared/hooks/use-approvals-feedback'
import { ApprovalsQueryState } from '../../shared/components/approvals-query-state'
import {
  ApprovalsButton,
  ApprovalsField,
  ApprovalsPagination,
  ApprovalsStatus,
  approvalsInputClass
} from '../../shared/components/approvals-ui'

export function SpendFinancePanel({
  requestId,
  canAsk,
  hasOpenQuestion
}: {
  requestId: string
  canAsk: boolean
  hasOpenQuestion: boolean
}) {
  const { t: translate } = useTranslation('approvalsSpend')
  const submissionLocked = useRef(false)
  const [page, setPage] = useState(1)
  const [question, setQuestion] = useState('')
  const review = useFinanceReviewGet(requestId, { query: { retry: false } })
  const information = useBudgetInformationOfRequest(requestId, { page, pageSize: 20 })
  const feedback = useApprovalsFeedback(
    [getBudgetInformationOfRequestQueryKey(requestId), getSpendApprovalGetQueryKey(requestId)],
    () => setQuestion('')
  )
  const ask = useBudgetInformationAsk({
    mutation: {
      ...feedback,
      onSettled: () => {
        submissionLocked.current = false
      }
    }
  })
  const reviewNotFound = isAxiosError(review.error) && review.error.response?.status === 404
  const finance = review.data?.data?.financeReview
  return (
    <div className='space-y-5'>
      <section className='space-y-3'>
        <h2 className='text-lg font-semibold'>{translate('finance')}</h2>
        {reviewNotFound ? (
          <p className='text-sm text-muted-foreground'>{translate('noFinance')}</p>
        ) : (
          <ApprovalsQueryState query={review}>
            {finance ? (
              <div className='space-y-3 rounded-lg border border-border p-4'>
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
      </section>
      <section className='space-y-3'>
        <h2 className='text-lg font-semibold'>{translate('questions')}</h2>
        <ApprovalsQueryState query={information}>
          {information.data?.data?.items.map((item) => (
            <article key={item.id} className='space-y-2 rounded-lg border border-border p-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <p className='text-sm font-medium'>{item.askedBy.fullName}</p>
                <ApprovalsStatus value={item.state} />
              </div>
              <p className='text-sm whitespace-pre-wrap [overflow-wrap:anywhere]'>{item.question}</p>
              {item.answer && (
                <div className='space-y-2 border-t border-border pt-3'>
                  <p className='text-xs text-muted-foreground'>{translate('answer')}</p>
                  <ApprovalsStatus value={item.answer.value} />
                  {item.answer.note && <p className='text-sm whitespace-pre-wrap'>{item.answer.note}</p>}
                  <p className='text-xs text-muted-foreground'>{item.answer.answeredBy.fullName}</p>
                </div>
              )}
            </article>
          ))}
          <ApprovalsPagination pagination={information.data?.data?.pagination} onPageChange={setPage} />
        </ApprovalsQueryState>
        {hasOpenQuestion && <p className='text-sm text-muted-foreground'>{translate('openQuestion')}</p>}
        {canAsk && !hasOpenQuestion && (
          <form
            className='space-y-3'
            onSubmit={(event) => {
              event.preventDefault()
              if (question.trim() && !ask.isPending && !submissionLocked.current) {
                submissionLocked.current = true
                ask.mutate({ id: requestId, data: { question: question.trim() } })
              }
            }}
          >
            <ApprovalsField label={translate('question')}>
              <textarea
                className={approvalsInputClass}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={translate('questionPlaceholder')}
                required
                maxLength={2000}
                disabled={ask.isPending}
              />
            </ApprovalsField>
            <ApprovalsButton type='submit' pending={ask.isPending} disabled={!question.trim()}>
              {translate('ask')}
            </ApprovalsButton>
          </form>
        )}
      </section>
    </div>
  )
}
