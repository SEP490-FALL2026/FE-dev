import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFinanceReviewComplete } from '~/shared/api/generated/operations/finance-reviews/finance-review-complete'
import { getFinanceReviewListQueryKey } from '~/shared/api/generated/operations/finance-reviews/finance-review-list'
import { getFinanceReviewGetQueryKey } from '~/shared/api/generated/operations/finance-reviews/finance-review-get'
import { getBudgetCheckGetQueryKey } from '~/shared/api/generated/operations/finance-reviews/budget-check-get'
import { getBudgetCheckYearListQueryKey } from '~/shared/api/generated/operations/finance-reviews/budget-check-year-list'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { FinanceButton, FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { ReviewDirection } from '../enums/review-direction'
import { ReviewOutcome } from '../enums/review-outcome'

export function FinanceReviewForm({
  requestId,
  disabled,
  waitingBudget,
  blocked,
  onPendingChange
}: {
  requestId: string
  disabled: boolean
  waitingBudget: boolean
  blocked: boolean
  onPendingChange: (value: boolean) => void
}) {
  const { t: translate } = useTranslation('financeSpend')
  const [outcome, setOutcome] = useState<ReviewOutcome>(ReviewOutcome.ASSESSED)
  const [direction, setDirection] = useState<ReviewDirection>(ReviewDirection.RECOMMEND_APPROVE)
  const [opinion, setOpinion] = useState('')
  const [reason, setReason] = useState('')
  const guard = useRef(false)
  const retrySeconds = useFinanceRetry()
  const feedback = useFinanceFeedback(
    [
      getFinanceReviewListQueryKey(),
      getFinanceReviewGetQueryKey(requestId),
      getBudgetCheckGetQueryKey(requestId),
      getBudgetCheckYearListQueryKey(requestId),
      getAccessRequestGetQueryKey(requestId)
    ],
    () => {
      setOpinion('')
      setReason('')
    }
  )
  const mutation = useFinanceReviewComplete({ mutation: feedback })
  const assessed = outcome === ReviewOutcome.ASSESSED
  const invalid = assessed
    ? !opinion.trim() || opinion.trim().length > 2000
    : !reason.trim() || reason.trim().length > 1000
  const prohibited =
    (waitingBudget && outcome === ReviewOutcome.NEEDS_BUDGET) || (blocked && outcome !== ReviewOutcome.RETURN_TO_HEAD)
  const submit = async () => {
    if (disabled || invalid || prohibited || mutation.isPending || guard.current || retrySeconds > 0) return
    guard.current = true
    onPendingChange(true)
    try {
      await mutation.mutateAsync({
        id: requestId,
        data: assessed ? { outcome, opinion: opinion.trim(), direction } : { outcome, reason: reason.trim() }
      })
    } catch {
      /* Feedback owns errors; keep the draft. */
    } finally {
      guard.current = false
      onPendingChange(false)
    }
  }
  return (
    <form
      className='space-y-4 border-t border-border pt-4'
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <FinanceField label={translate('review.outcome')}>
        <select
          aria-label={translate('review.outcome')}
          className={financeInputClass}
          disabled={mutation.isPending}
          value={outcome}
          onChange={(event) => setOutcome(event.target.value as ReviewOutcome)}
        >
          {Object.values(ReviewOutcome).map((value) => (
            <option
              key={value}
              value={value}
              disabled={
                (waitingBudget && value === ReviewOutcome.NEEDS_BUDGET) ||
                (blocked && value !== ReviewOutcome.RETURN_TO_HEAD)
              }
            >
              {translate(`codes.${value}`)}
            </option>
          ))}
        </select>
      </FinanceField>
      {assessed ? (
        <>
          <FinanceField label={translate('review.direction')}>
            <select
              aria-label={translate('review.direction')}
              className={financeInputClass}
              value={direction}
              disabled={mutation.isPending}
              onChange={(event) => setDirection(event.target.value as ReviewDirection)}
            >
              {Object.values(ReviewDirection).map((value) => (
                <option key={value} value={value}>
                  {translate(`codes.${value}`)}
                </option>
              ))}
            </select>
          </FinanceField>
          <FinanceField label={translate('review.opinion')}>
            <textarea
              aria-label={translate('review.opinion')}
              className={financeInputClass}
              rows={4}
              maxLength={2000}
              value={opinion}
              disabled={mutation.isPending}
              onChange={(event) => setOpinion(event.target.value)}
              required
            />
          </FinanceField>
        </>
      ) : (
        <FinanceField label={translate('common.reason')}>
          <textarea
            aria-label={translate('common.reason')}
            className={financeInputClass}
            rows={4}
            maxLength={1000}
            value={reason}
            disabled={mutation.isPending}
            onChange={(event) => setReason(event.target.value)}
            required
          />
        </FinanceField>
      )}
      {(disabled || prohibited) && (
        <p className='text-sm text-muted-foreground'>{translate(prohibited ? 'review.blocked' : 'review.readOnly')}</p>
      )}
      <FinanceButton
        type='submit'
        variant='primary'
        pending={mutation.isPending}
        disabled={disabled || invalid || prohibited}
      >
        {translate('review.submit')}
      </FinanceButton>
    </form>
  )
}
