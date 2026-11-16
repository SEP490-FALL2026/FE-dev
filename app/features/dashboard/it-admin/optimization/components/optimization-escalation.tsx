import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { usePolicyStepGet } from '~/shared/api/generated/operations/policies/policy-step-get'
import { ghostSeatEscalationCreate } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-escalation-create'
import type { EscalationBodyDto, EscalationResponseDtoDataResultsItem } from '~/shared/api/generated/model'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItField, itButtonClass, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getGhostSeatRecommendationListQueryKey } from '~/shared/api/generated/operations/ghost-seats/ghost-seat-recommendation-list'

export function OptimizationEscalation({
  ids,
  labels,
  onBack
}: {
  ids: string[]
  labels: Record<string, string>
  onBack: () => void
}) {
  const { t } = useTranslation('itOptimization')
  const policy = usePolicyStepGet('POL-USAGE', '5.3')
  const [answers, setAnswers] = useState<Record<string, 'YES' | 'NO'>>({})
  const [note, setNote] = useState('')
  const [results, setResults] = useState<EscalationResponseDtoDataResultsItem[]>()
  // Bind retries to the exact batch, policy version and answers, including after an uncertain response.
  const attempts = useRef(new Map<string, string>())
  const feedback = useItMutationFeedback([getGhostSeatRecommendationListQueryKey()])
  const submit = useMutation({
    mutationFn: (body: EscalationBodyDto) => {
      const fingerprint = JSON.stringify(body)
      let key = attempts.current.get(fingerprint)
      if (!key) {
        key = crypto.randomUUID()
        attempts.current.set(fingerprint, key)
      }
      return ghostSeatEscalationCreate(body, { headers: { 'Idempotency-Key': key } })
    },
    ...feedback,
    onError: async (error) => {
      await feedback.onError(error)
      await policy.refetch()
      setAnswers({})
    },
    onSuccess: async (response) => {
      await feedback.onSuccess()
      if (response.data) setResults(response.data.results)
    }
  })
  const current = policy.data?.data
  const questions = current?.step.checklist.filter((item) => item.check === 'PERSON') ?? []
  const ready =
    current &&
    !policy.isFetching &&
    ids.length > 0 &&
    ids.length <= 100 &&
    questions.every((item) => answers[item.code] === 'YES')
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack} disabled={submit.isPending}>
        {t('optimization.back')}
      </button>
      <h1 className='text-2xl font-semibold'>{results ? t('result') : t('escalate')}</h1>
      {results ? (
        <ul className='divide-y divide-border rounded-lg border border-border bg-surface'>
          {results.map((result) => (
            <li key={result.recommendationId} className='space-y-2 p-4'>
              <p>{labels[result.recommendationId] ?? t('unavailable')}</p>
              <p>
                {t(result.outcome)} ·{' '}
                {result.reason
                  ? t(result.reason)
                  : result.state === 'WAITING_FOR_HEAD'
                    ? t('missingHead')
                    : t('optimization.states.AWAITING_DECISION')}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p className='text-sm text-muted-foreground'>{t('escalateHint')}</p>
          <ul className='list-inside list-disc text-sm'>
            {ids.map((id) => (
              <li key={id}>{labels[id]}</li>
            ))}
          </ul>
          <ItQueryState query={policy}>
            <form
              className='space-y-5'
              onSubmit={(event) => {
                event.preventDefault()
                if (ready && !submit.isPending)
                  submit.mutate({
                    recommendationIds: ids,
                    ...(note.trim() ? { note: note.trim() } : {}),
                    checklist: {
                      policyVersionId: current!.policyVersionId,
                      answers: questions.map((item) => ({ itemCode: item.code, answer: answers[item.code] }))
                    }
                  })
              }}
            >
              {questions.map((item) => (
                <fieldset
                  key={`${current?.policyVersionId}-${item.code}`}
                  className='space-y-2 rounded-lg border border-border p-4'
                  disabled={submit.isPending}
                >
                  <legend className='px-1 text-sm'>{item.text}</legend>
                  <div className='flex gap-6'>
                    {(['YES', 'NO'] as const).map((answer) => (
                      <label key={answer} className='flex min-h-11 items-center gap-2'>
                        <input
                          type='radio'
                          name={item.code}
                          required
                          checked={answers[item.code] === answer}
                          onChange={() => setAnswers((previous) => ({ ...previous, [item.code]: answer }))}
                        />
                        {t(answer === 'YES' ? 'yes' : 'no')}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <ItField label={t('note')} hint={t('noteHint')}>
                <textarea
                  className={itInputClass}
                  value={note}
                  maxLength={500}
                  disabled={submit.isPending}
                  onChange={(event) => setNote(event.target.value)}
                />
              </ItField>
              <button type='submit' className={itButtonClass} disabled={!ready || submit.isPending}>
                {t('confirm')}
              </button>
            </form>
          </ItQueryState>
        </>
      )}
    </section>
  )
}
