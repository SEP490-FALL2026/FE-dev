import { Ban, CheckCircle2, Info, Send, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BudgetSnapshotPanel, CostEstimatePanel, getBorneCost, getRemaining } from '../../budget-figures'
import {
  FilterChips,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  inputClassName,
  primaryButtonClassName,
  useDashboardFormat,
  type Tone
} from '../../dashboard-ui'
import { budgetQuestions, findBudgetLine, type BudgetOpinion, type BudgetQuestion } from '../finance-data'

type QuestionFilter = 'all' | BudgetQuestion['status']

const opinionTones: Record<BudgetOpinion, Tone> = { NO_BUDGET: 'warning', OVER: 'danger', WITHIN: 'success' }
const opinions: readonly BudgetOpinion[] = ['WITHIN', 'OVER', 'NO_BUDGET']

export function FinanceBudgetQuestionsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime } = useDashboardFormat()
  const [questions, setQuestions] = useState(budgetQuestions)
  const [filter, setFilter] = useState<QuestionFilter>('OPEN')
  const [selectedId, setSelectedId] = useState(budgetQuestions[0].id)
  const [opinion, setOpinion] = useState<BudgetOpinion | null>(null)
  const [note, setNote] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const visible = questions.filter((question) => filter === 'all' || question.status === filter)
  const selected = questions.find((question) => question.id === selectedId) ?? questions[0]
  const snapshot = findBudgetLine(selected.costCenter)
  const remaining = snapshot ? getRemaining(snapshot) : null
  const suggested: BudgetOpinion =
    remaining === null ? 'NO_BUDGET' : remaining - getBorneCost(selected.estimate) >= 0 ? 'WITHIN' : 'OVER'

  const statusLabel = (status: BudgetQuestion['status']) => t(`finance.questions.status.${status}`)
  const statusTone: Record<BudgetQuestion['status'], Tone> = {
    ANSWERED: 'success',
    CLOSED_CANCELLED: 'neutral',
    OPEN: 'info'
  }

  const selectQuestion = (id: string) => {
    setSelectedId(id)
    setOpinion(null)
    setNote('')
    setShowErrors(false)
  }

  const submitAnswer = () => {
    if (!opinion || note.trim().length === 0) {
      setShowErrors(true)
      return
    }
    setQuestions((current) =>
      current.map((question) =>
        question.id === selected.id
          ? {
              ...question,
              answer: { answeredAt: new Date().toISOString(), note: note.trim(), opinion },
              status: 'ANSWERED'
            }
          : question
      )
    )
    setShowErrors(false)
  }

  const count = (status: BudgetQuestion['status']) => questions.filter((question) => question.status === status).length

  return (
    <div className='space-y-6'>
      <PageHeader
        code='UF-11 · FIN-05'
        subtitle={t('finance.questions.subtitle')}
        title={t('finance.questions.title')}
      />

      <Notice icon={Info} tone='info'>
        {t('finance.questions.ruleNotice')}
      </Notice>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]'>
        <Panel className='h-fit'>
          <FilterChips<QuestionFilter>
            label={t('finance.questions.filterLabel')}
            onChange={setFilter}
            options={[
              { count: count('OPEN'), label: statusLabel('OPEN'), value: 'OPEN' },
              { count: count('ANSWERED'), label: statusLabel('ANSWERED'), value: 'ANSWERED' },
              { count: count('CLOSED_CANCELLED'), label: statusLabel('CLOSED_CANCELLED'), value: 'CLOSED_CANCELLED' },
              { label: t('ui.all'), value: 'all' }
            ]}
            value={filter}
          />

          <ul className='mt-4 space-y-2'>
            {visible.map((question) => {
              const isSelected = question.id === selected.id

              return (
                <li key={question.id}>
                  <button
                    aria-current={isSelected ? 'true' : undefined}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? 'border-primary bg-primary-soft/40'
                        : 'border-border hover:border-primary/40 hover:bg-surface-subtle/60'
                    }`}
                    onClick={() => selectQuestion(question.id)}
                    type='button'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='font-mono text-xs font-bold text-primary'>{question.requestCode}</span>
                      <Pill tone={statusTone[question.status]}>{statusLabel(question.status)}</Pill>
                    </div>
                    <p className='mt-1 truncate text-sm font-bold text-foreground'>{question.software}</p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {question.costCenter} · {formatCurrency(getBorneCost(question.estimate))}
                    </p>
                    <p className='mt-1 text-[0.7rem] text-muted-foreground'>
                      {t('finance.questions.askedBy', {
                        name: question.askedBy,
                        time: formatDateTime(question.askedAt)
                      })}
                    </p>
                  </button>
                </li>
              )
            })}
            {visible.length === 0 && (
              <li className='rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground'>
                {t('finance.questions.empty')}
              </li>
            )}
          </ul>
        </Panel>

        <Panel>
          <PanelTitle
            action={<Pill tone={statusTone[selected.status]}>{statusLabel(selected.status)}</Pill>}
            hint={`${selected.requestCode} · ${t('finance.questions.requester', { name: selected.requester })}`}
            title={selected.software}
          />

          <blockquote className='mt-4 rounded-xl border-l-4 border-info bg-info/5 p-3 text-sm text-foreground'>
            <p className='text-[0.7rem] font-bold text-info'>
              {t('finance.questions.askedBy', { name: selected.askedBy, time: formatDateTime(selected.askedAt) })}
            </p>
            <p className='mt-1'>{selected.question}</p>
          </blockquote>

          <div className='mt-4 grid gap-4 md:grid-cols-2'>
            {snapshot && <BudgetSnapshotPanel formatCurrency={formatCurrency} snapshot={snapshot} />}
            <CostEstimatePanel estimate={selected.estimate} formatCurrency={formatCurrency} />
          </div>

          <div className='mt-5 border-t border-border pt-5'>
            {selected.status === 'CLOSED_CANCELLED' ? (
              <Notice icon={Ban} tone='neutral'>
                {t('finance.questions.cancelledNotice')}
              </Notice>
            ) : selected.status === 'ANSWERED' && selected.answer ? (
              <div className='space-y-3'>
                <Notice icon={CheckCircle2} tone='success'>
                  {t('finance.questions.answeredNotice')}
                </Notice>
                <div className='rounded-xl border border-border p-3 text-xs'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Pill tone={opinionTones[selected.answer.opinion]}>
                      {t(`finance.opinion.${selected.answer.opinion}`)}
                    </Pill>
                    <span className='text-muted-foreground'>{formatDateTime(selected.answer.answeredAt)}</span>
                  </div>
                  <p className='mt-2 text-foreground'>{selected.answer.note}</p>
                </div>
              </div>
            ) : selected.responderIsApprover ? (
              <Notice icon={ShieldAlert} tone='danger'>
                {t('finance.questions.sodBlocked')}
              </Notice>
            ) : (
              <form
                className='space-y-4'
                onSubmit={(event) => {
                  event.preventDefault()
                  submitAnswer()
                }}
              >
                <fieldset>
                  <legend className='text-xs font-bold text-foreground'>{t('finance.questions.replyLegend')}</legend>
                  <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                    {t('finance.questions.suggested', { opinion: t(`finance.opinion.${suggested}`) })}
                  </p>
                  <div className='mt-2 grid gap-2 sm:grid-cols-3'>
                    {opinions.map((value) => (
                      <label
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                          opinion === value
                            ? 'border-primary bg-primary-soft/40'
                            : 'border-border hover:border-primary/40'
                        }`}
                        key={value}
                      >
                        <input
                          checked={opinion === value}
                          className='accent-primary'
                          name='budget-opinion'
                          onChange={() => setOpinion(value)}
                          type='radio'
                          value={value}
                        />
                        {t(`finance.opinion.${value}`)}
                      </label>
                    ))}
                  </div>
                  {showErrors && !opinion && (
                    <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                      {t('finance.questions.opinionRequired')}
                    </p>
                  )}
                </fieldset>

                <div>
                  <label className='text-xs font-bold text-foreground' htmlFor='budget-question-note'>
                    {t('finance.questions.noteLabel')}
                  </label>
                  <textarea
                    className={`${inputClassName} mt-2 min-h-24`}
                    id='budget-question-note'
                    onChange={(event) => setNote(event.target.value)}
                    placeholder={t('finance.questions.notePlaceholder')}
                    value={note}
                  />
                  {showErrors && note.trim().length === 0 && (
                    <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                      {t('finance.questions.noteRequired')}
                    </p>
                  )}
                </div>

                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <p className='text-[0.7rem] text-muted-foreground'>{t('finance.questions.slaNote')}</p>
                  <button className={primaryButtonClassName} type='submit'>
                    <Send aria-hidden='true' className='size-3.5' />
                    {t('finance.questions.submit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
