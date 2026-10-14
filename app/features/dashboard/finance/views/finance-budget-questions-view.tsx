import { ArrowLeft, Ban, CheckCircle2, ChevronRight, MessageSquareText, Send, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  BudgetSnapshotPanel,
  CostEstimatePanel,
  RemainingValue,
  getBorneCost,
  getRemaining
} from '../../budget-figures'
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
import {
  budgetQuestions,
  currentPeriod,
  findBudgetLine,
  type BudgetOpinion,
  type BudgetQuestion
} from '../finance-data'

type QuestionFilter = 'all' | BudgetQuestion['status']

const opinionTones: Record<BudgetOpinion, Tone> = { NO_BUDGET: 'warning', OVER: 'danger', WITHIN: 'success' }
const opinions: readonly BudgetOpinion[] = ['WITHIN', 'OVER', 'NO_BUDGET']
const statusTones: Record<BudgetQuestion['status'], Tone> = {
  ANSWERED: 'success',
  CLOSED_CANCELLED: 'neutral',
  OPEN: 'info'
}

function KeyFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='min-w-0 rounded-xl border border-border bg-surface px-4 py-3'>
      <p className='truncate text-[0.7rem] font-semibold text-muted-foreground'>{label}</p>
      <div className='mt-1 truncate text-base font-extrabold text-foreground'>{value}</div>
    </div>
  )
}

export function FinanceBudgetQuestionsView({ formatCurrency }: { formatCurrency: (value: number) => string }) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime } = useDashboardFormat()
  const [questions, setQuestions] = useState(budgetQuestions)
  const [filter, setFilter] = useState<QuestionFilter>('OPEN')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [opinion, setOpinion] = useState<BudgetOpinion | null>(null)
  const [note, setNote] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const statusLabel = (status: BudgetQuestion['status']) => t(`finance.questions.status.${status}`)
  const count = (status: BudgetQuestion['status']) => questions.filter((question) => question.status === status).length

  const openQuestion = (id: string) => {
    setSelectedId(id)
    setOpinion(null)
    setNote('')
    setShowErrors(false)
  }

  const selected = questions.find((question) => question.id === selectedId)

  // ---------------------------------------------------------------- List
  if (!selected) {
    const visible = questions.filter((question) => filter === 'all' || question.status === filter)

    return (
      <div className='space-y-6'>
        <PageHeader
          code='UF-11 · FIN-05'
          subtitle={t('finance.questions.subtitle')}
          title={t('finance.questions.title')}
        />

        <Panel className='p-0'>
          <div className='border-b border-border p-4'>
            <FilterChips<QuestionFilter>
              label={t('finance.questions.filterLabel')}
              onChange={setFilter}
              options={[
                { count: count('OPEN'), label: statusLabel('OPEN'), value: 'OPEN' },
                { count: count('ANSWERED'), label: statusLabel('ANSWERED'), value: 'ANSWERED' },
                { count: count('CLOSED_CANCELLED'), label: statusLabel('CLOSED_CANCELLED'), value: 'CLOSED_CANCELLED' },
                { count: questions.length, label: t('ui.all'), value: 'all' }
              ]}
              value={filter}
            />
          </div>

          <div
            aria-hidden='true'
            className='hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_7rem_1rem] gap-4 border-b border-border px-4 py-2.5 text-[0.7rem] font-semibold text-muted-foreground md:grid'
          >
            <span>{t('finance.questions.colRequest')}</span>
            <span>{t('budget.costCenter')}</span>
            <span className='text-right'>{t('budget.borneCost')}</span>
            <span>{t('finance.questions.colAsked')}</span>
            <span>{t('finance.questions.colStatus')}</span>
            <span />
          </div>

          <ul className='divide-y divide-border'>
            {visible.map((question) => (
              <li key={question.id}>
                <button
                  className='grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3.5 text-left text-xs transition hover:bg-surface-subtle/60 focus-visible:bg-surface-subtle focus-visible:outline-none md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_7rem_1rem]'
                  onClick={() => openQuestion(question.id)}
                  type='button'
                >
                  <span className='min-w-0'>
                    <span className='block truncate text-sm font-bold text-foreground'>{question.software}</span>
                    <span className='font-mono text-[0.7rem] text-muted-foreground'>{question.requestCode}</span>
                  </span>
                  <span className='hidden font-mono text-muted-foreground md:block'>{question.costCenter}</span>
                  <span className='hidden text-right font-semibold md:block'>
                    {formatCurrency(getBorneCost(question.estimate))}
                  </span>
                  <span className='hidden min-w-0 md:block'>
                    <span className='block truncate text-foreground'>{question.askedBy}</span>
                    <span className='text-[0.7rem] text-muted-foreground'>{formatDateTime(question.askedAt)}</span>
                  </span>
                  <span className='justify-self-end md:justify-self-start'>
                    <Pill tone={statusTones[question.status]}>{statusLabel(question.status)}</Pill>
                  </span>
                  <ChevronRight aria-hidden='true' className='hidden size-4 text-muted-foreground md:block' />
                  <span className='col-span-2 text-[0.7rem] text-muted-foreground md:hidden'>
                    {question.costCenter} · {formatCurrency(getBorneCost(question.estimate))} ·{' '}
                    {formatDateTime(question.askedAt)}
                  </span>
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className='p-8 text-center text-xs text-muted-foreground'>{t('finance.questions.empty')}</li>
            )}
          </ul>
        </Panel>
      </div>
    )
  }

  // ---------------------------------------------------------------- Detail
  const snapshot = findBudgetLine(selected.costCenter)
  const borneCost = getBorneCost(selected.estimate)
  const remaining = snapshot ? getRemaining(snapshot) : null
  const remainingAfter = remaining === null ? null : remaining - borneCost
  const suggested: BudgetOpinion = remainingAfter === null ? 'NO_BUDGET' : remainingAfter >= 0 ? 'WITHIN' : 'OVER'

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

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={() => setSelectedId(null)}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('finance.questions.backToList')}
      </button>

      <PageHeader
        actions={<Pill tone={statusTones[selected.status]}>{statusLabel(selected.status)}</Pill>}
        code='UF-11 · FIN-05'
        subtitle={`${selected.requestCode} · ${t('finance.questions.requester', { name: selected.requester })}`}
        title={selected.software}
      />

      <section aria-label={t('finance.questions.summaryLabel')} className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <KeyFact label={t('budget.borneCost')} value={formatCurrency(borneCost)} />
        <KeyFact label={t('finance.questions.factCostCenter')} value={`${selected.costCenter} · ${currentPeriod}`} />
        <KeyFact
          label={t('finance.questions.factRemainingNow')}
          value={<RemainingValue formatCurrency={formatCurrency} remaining={remaining} />}
        />
        <KeyFact
          label={t('finance.questions.factRemainingAfter')}
          value={<RemainingValue formatCurrency={formatCurrency} remaining={remainingAfter} />}
        />
      </section>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <Panel>
            <PanelTitle title={t('finance.questions.questionTitle')} />
            <div className='mt-3 flex items-start gap-3 rounded-xl border-l-4 border-info bg-info/5 p-3'>
              <MessageSquareText aria-hidden='true' className='mt-0.5 size-4 shrink-0 text-info' />
              <div className='min-w-0'>
                <p className='text-[0.7rem] font-bold text-info'>
                  {t('finance.questions.askedBy', { name: selected.askedBy, time: formatDateTime(selected.askedAt) })}
                </p>
                <p className='mt-1 text-sm text-foreground'>{selected.question}</p>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelTitle hint={t('budget.borneCostNote')} title={t('finance.questions.contextTitle')} />
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              {snapshot && <BudgetSnapshotPanel formatCurrency={formatCurrency} snapshot={snapshot} />}
              <CostEstimatePanel estimate={selected.estimate} formatCurrency={formatCurrency} />
            </div>
          </Panel>
        </div>

        <div className='xl:sticky xl:top-24 xl:self-start'>
          <Panel className='border-primary/40'>
            {selected.status === 'CLOSED_CANCELLED' ? (
              <>
                <PanelTitle title={t('finance.questions.replyTitle')} />
                <div className='mt-4'>
                  <Notice icon={Ban} tone='neutral'>
                    {t('finance.questions.cancelledNotice')}
                  </Notice>
                </div>
              </>
            ) : selected.status === 'ANSWERED' && selected.answer ? (
              <>
                <PanelTitle title={t('finance.questions.answerTitle')} />
                <div className='mt-4 space-y-3'>
                  <div className='rounded-xl border border-border bg-background p-3 text-xs'>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <Pill tone={opinionTones[selected.answer.opinion]}>
                        {t(`finance.opinion.${selected.answer.opinion}`)}
                      </Pill>
                      <span className='text-muted-foreground'>{formatDateTime(selected.answer.answeredAt)}</span>
                    </div>
                    <p className='mt-2 text-sm text-foreground'>{selected.answer.note}</p>
                  </div>
                  <Notice icon={CheckCircle2} tone='success'>
                    {t('finance.questions.answeredNotice')}
                  </Notice>
                </div>
              </>
            ) : selected.responderIsApprover ? (
              <>
                <PanelTitle title={t('finance.questions.replyTitle')} />
                <div className='mt-4'>
                  <Notice icon={ShieldAlert} tone='danger'>
                    {t('finance.questions.sodBlocked')}
                  </Notice>
                </div>
              </>
            ) : (
              <>
                <PanelTitle hint={t('finance.questions.ruleNotice')} title={t('finance.questions.replyTitle')} />
                <form
                  className='mt-4 space-y-4'
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
                    <div className='mt-2 space-y-2'>
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
                          <span className='flex-1'>{t(`finance.opinion.${value}`)}</span>
                          {value === suggested && <Pill tone='primary'>{t('finance.questions.suggestedTag')}</Pill>}
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
                      className={`${inputClassName} mt-2 min-h-28`}
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

                  <button className={`${primaryButtonClassName} w-full`} type='submit'>
                    <Send aria-hidden='true' className='size-3.5' />
                    {t('finance.questions.submit')}
                  </button>
                  <p className='text-[0.7rem] text-muted-foreground'>{t('finance.questions.slaNote')}</p>
                </form>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
