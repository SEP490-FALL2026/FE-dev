import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { InformationListResponseDtoDataItemsItem } from '~/shared/api/generated/model/budget-information/informationListResponseDtoDataItemsItem'
import { useBudgetInformationAnswer } from '~/shared/api/generated/operations/budget-information/budget-information-answer'
import { getBudgetInformationListQueryKey } from '~/shared/api/generated/operations/budget-information/budget-information-list'
import { getBudgetInformationOfRequestQueryKey } from '~/shared/api/generated/operations/budget-information/budget-information-of-request'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import {
  FinanceButton,
  FinanceDrawer,
  FinanceField,
  FinanceQueryState,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { QuestionAnswer } from '../enums/question-answer'
import { QuestionState } from '../enums/question-state'

export function FinanceQuestionAnswer({
  item,
  fresh,
  onClose
}: {
  item: InformationListResponseDtoDataItemsItem
  fresh: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financeSpend')
  const [answer, setAnswer] = useState<QuestionAnswer>(QuestionAnswer.WITHIN_LIMIT)
  const [note, setNote] = useState('')
  const guard = useRef(false)
  const retrySeconds = useFinanceRetry()
  const me = useMeGet()
  const feedback = useFinanceFeedback(
    [getBudgetInformationListQueryKey(), getBudgetInformationOfRequestQueryKey(item.requestId)],
    () => {
      setNote('')
    }
  )
  const mutation = useBudgetInformationAnswer({ mutation: feedback })
  const disabled =
    !fresh ||
    item.state !== QuestionState.OPEN ||
    !me.data?.data?.roles.effective.includes('FINANCE') ||
    me.isFetching ||
    me.isError ||
    note.trim().length > 2000
  const submit = async () => {
    if (disabled || guard.current || mutation.isPending || retrySeconds > 0) return
    guard.current = true
    try {
      await mutation.mutateAsync({ id: item.id, data: { answer, ...(note.trim() ? { note: note.trim() } : {}) } })
    } catch {
      /* Keep the answer draft. */
    } finally {
      guard.current = false
    }
  }
  return (
    <FinanceDrawer title={translate('questions.detail')} onClose={onClose} pending={mutation.isPending}>
      <p className='break-all font-mono text-sm'>{item.requestId}</p>
      <p className='whitespace-pre-wrap'>{item.question}</p>
      <FinanceStatus value={item.state} />
      {item.answer && (
        <div className='space-y-2'>
          <FinanceStatus value={item.answer.value} />
          <p className='whitespace-pre-wrap'>{item.answer.note}</p>
          <p>{item.answer.answeredBy.fullName}</p>
        </div>
      )}
      {item.closeReason && <FinanceStatus value={item.closeReason} />}
      <FinanceQueryState query={me}>
        <span />
      </FinanceQueryState>
      <form
        className='space-y-4'
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <FinanceField label={translate('questions.answer')}>
          <select
            aria-label={translate('questions.answer')}
            className={financeInputClass}
            value={answer}
            disabled={mutation.isPending}
            onChange={(event) => setAnswer(event.target.value as QuestionAnswer)}
          >
            {Object.values(QuestionAnswer).map((value) => (
              <option key={value} value={value}>
                {translate(`codes.${value}`)}
              </option>
            ))}
          </select>
        </FinanceField>
        <FinanceField label={translate('common.note')}>
          <textarea
            aria-label={translate('common.note')}
            className={financeInputClass}
            rows={4}
            maxLength={2000}
            value={note}
            disabled={mutation.isPending}
            onChange={(event) => setNote(event.target.value)}
          />
        </FinanceField>
        {disabled && <p className='text-sm text-muted-foreground'>{translate('questions.readOnly')}</p>}
        <FinanceButton variant='primary' type='submit' pending={mutation.isPending} disabled={disabled}>
          {translate('questions.submit')}
        </FinanceButton>
      </form>
    </FinanceDrawer>
  )
}
