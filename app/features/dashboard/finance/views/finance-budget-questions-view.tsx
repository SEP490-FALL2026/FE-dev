import { ArrowLeft, Ban, CheckCircle2, ChevronRight, Inbox, Info, Paperclip, Send, ShieldAlert } from 'lucide-react'
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
import type { FinanceTabKey } from '../finance-nav'

type QuestionFilter = 'all' | BudgetQuestion['status']
type QuestionAnswer = NonNullable<BudgetQuestion['answer']>

const opinionTones: Record<BudgetOpinion, Tone> = { NO_BUDGET: 'warning', OVER: 'danger', WITHIN: 'success' }
const opinions: readonly BudgetOpinion[] = ['WITHIN', 'OVER', 'NO_BUDGET']
const statusTones: Record<BudgetQuestion['status'], Tone> = {
  ANSWERED: 'success',
  CLOSED_CANCELLED: 'neutral',
  OPEN: 'info'
}

/**
 * FIN-05: the list opens first; choosing a request opens its own detail screen (`id` search param).
 * The view stays mounted while switching between the two, so answers and the filter survive the round trip.
 */
export function FinanceBudgetQuestionsView({
  formatCurrency,
  onSelectTab,
  questionId
}: {
  formatCurrency: (value: number) => string
  onSelectTab: (tab: FinanceTabKey, extraParams?: Record<string, string>) => void
  questionId?: string
}) {
  const [questions, setQuestions] = useState(budgetQuestions)
  const [filter, setFilter] = useState<QuestionFilter>('all')
  const selected = questions.find((question) => question.id === questionId)

  const answerQuestion = (id: string, answer: QuestionAnswer) => {
    setQuestions((current) =>
      current.map((question) => (question.id === id ? { ...question, answer, status: 'ANSWERED' } : question))
    )
  }

  if (selected) {
    return (
      <BudgetQuestionDetail
        formatCurrency={formatCurrency}
        key={selected.id}
        onAnswer={(answer) => answerQuestion(selected.id, answer)}
        onBack={() => onSelectTab('budget-questions')}
        question={selected}
      />
    )
  }

  return (
    <BudgetQuestionList
      filter={filter}
      formatCurrency={formatCurrency}
      onFilterChange={setFilter}
      onOpen={(id) => onSelectTab('budget-questions', { id })}
      questions={questions}
    />
  )
}

function BudgetQuestionList({
  filter,
  formatCurrency,
  onFilterChange,
  onOpen,
  questions
}: {
  filter: QuestionFilter
  formatCurrency: (value: number) => string
  onFilterChange: (filter: QuestionFilter) => void
  onOpen: (id: string) => void
  questions: BudgetQuestion[]
}) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime } = useDashboardFormat()

  const visible = questions.filter((question) => filter === 'all' || question.status === filter)
  const count = (status: BudgetQuestion['status']) => questions.filter((question) => question.status === status).length
  const statusLabel = (status: BudgetQuestion['status']) => t(`finance.questions.status.${status}`)

  return (
    <div className='space-y-6'>
      <PageHeader subtitle={t('finance.questions.subtitle')} title={t('finance.questions.title')} />

      <Notice icon={Info} tone='info'>
        {t('finance.questions.ruleNotice')}
      </Notice>

      <Panel>
        <FilterChips<QuestionFilter>
          label={t('finance.questions.filterLabel')}
          onChange={onFilterChange}
          options={[
            { count: questions.length, label: t('ui.all'), value: 'all' },
            { count: count('OPEN'), label: statusLabel('OPEN'), value: 'OPEN' },
            { count: count('ANSWERED'), label: statusLabel('ANSWERED'), value: 'ANSWERED' },
            { count: count('CLOSED_CANCELLED'), label: statusLabel('CLOSED_CANCELLED'), value: 'CLOSED_CANCELLED' }
          ]}
          value={filter}
        />

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full min-w-184 text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-2.5 font-semibold'>{t('finance.questions.colRequest')}</th>
                <th className='py-2.5 font-semibold'>{t('budget.costCenter')}</th>
                <th className='py-2.5 text-right font-semibold'>{t('budget.borneCost')}</th>
                <th className='py-2.5 pl-6 font-semibold'>{t('finance.questions.colSentBy')}</th>
                <th className='py-2.5 font-semibold'>{t('finance.questions.colStatus')}</th>
                <th className='py-2.5'>
                  <span className='sr-only'>{t('finance.questions.openDetail')}</span>
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {visible.map((question) => (
                <tr
                  className='cursor-pointer transition hover:bg-surface-subtle/60'
                  key={question.id}
                  onClick={() => onOpen(question.id)}
                >
                  <td className='py-3'>
                    <p className='font-mono font-bold text-primary'>{question.requestCode}</p>
                    <p className='mt-0.5 font-semibold text-foreground'>{question.software}</p>
                  </td>
                  <td className='py-3 font-mono'>{question.costCenter}</td>
                  <td className='py-3 text-right font-bold'>{formatCurrency(getBorneCost(question.estimate))}</td>
                  <td className='py-3 pl-6'>
                    <p className='font-semibold text-foreground'>{question.askedBy}</p>
                    <p className='text-[0.7rem] text-muted-foreground'>{formatDateTime(question.askedAt)}</p>
                  </td>
                  <td className='py-3'>
                    <Pill tone={statusTones[question.status]}>{statusLabel(question.status)}</Pill>
                  </td>
                  <td className='py-3 text-right'>
                    <button
                      aria-label={t('finance.questions.openDetailFor', { code: question.requestCode })}
                      className='inline-flex items-center gap-1 font-bold text-primary hover:underline'
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpen(question.id)
                      }}
                      type='button'
                    >
                      {t('finance.questions.openDetail')}
                      <ChevronRight aria-hidden='true' className='size-3.5' />
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td className='py-8 text-center text-muted-foreground' colSpan={6}>
                    {t('finance.questions.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

function BudgetQuestionDetail({
  formatCurrency,
  onAnswer,
  onBack,
  question
}: {
  formatCurrency: (value: number) => string
  onAnswer: (answer: QuestionAnswer) => void
  onBack: () => void
  question: BudgetQuestion
}) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime } = useDashboardFormat()
  const [opinion, setOpinion] = useState<BudgetOpinion | null>(null)
  const [note, setNote] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  const snapshot = findBudgetLine(question.costCenter)
  const remaining = snapshot ? getRemaining(snapshot) : null
  const suggested: BudgetOpinion =
    remaining === null ? 'NO_BUDGET' : remaining - getBorneCost(question.estimate) >= 0 ? 'WITHIN' : 'OVER'

  const submitAnswer = () => {
    if (!opinion || note.trim().length === 0) {
      setShowErrors(true)
      return
    }
    onAnswer({ answeredAt: new Date().toISOString(), note: note.trim(), opinion })
  }

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={onBack}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('finance.questions.backToList')}
      </button>

      <PageHeader
        actions={<Pill tone={statusTones[question.status]}>{t(`finance.questions.status.${question.status}`)}</Pill>}
        subtitle={`${question.requestCode} · ${t('finance.questions.requester', { name: question.requester })}`}
        title={question.software}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
        <Panel>
          <p className='flex items-center gap-1.5 text-[0.7rem] font-bold tracking-wide text-primary uppercase'>
            <Inbox aria-hidden='true' className='size-3.5' />
            {t('finance.questions.requestKicker')}
          </p>

          <div className='mt-3 rounded-xl border border-border bg-background p-4'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <p className='text-xs font-semibold text-foreground'>
                {t('finance.questions.from', { name: question.askedBy })}
              </p>
              <span className='text-[0.7rem] text-muted-foreground'>{formatDateTime(question.askedAt)}</span>
            </div>
            <p className='mt-3 rounded-lg border-l-4 border-info bg-info/5 p-3 text-sm text-foreground'>
              {question.question}
            </p>
          </div>

          <section
            aria-labelledby='budget-request-dossier'
            className='mt-4 rounded-xl border border-dashed border-border bg-surface-subtle/40 p-4'
          >
            <h2 className='flex items-center gap-1.5 text-xs font-bold text-foreground' id='budget-request-dossier'>
              <Paperclip aria-hidden='true' className='size-3.5' />
              {t('finance.questions.dossierTitle')}
            </h2>
            <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>{t('finance.questions.dossierHint')}</p>

            <div className='mt-3 space-y-3'>
              {snapshot && (
                <BudgetSnapshotPanel
                  formatCurrency={formatCurrency}
                  snapshot={snapshot}
                  title={t('finance.questions.dossierBudget')}
                />
              )}
              <CostEstimatePanel
                estimate={question.estimate}
                formatCurrency={formatCurrency}
                title={t('finance.questions.dossierCost')}
              />
            </div>
          </section>
        </Panel>

        <Panel className='h-fit xl:sticky xl:top-0'>
          <PanelTitle title={t('finance.questions.replyLegend')} />
          <div className='mt-4'>
            {question.status === 'CLOSED_CANCELLED' ? (
              <Notice icon={Ban} tone='neutral'>
                {t('finance.questions.cancelledNotice')}
              </Notice>
            ) : question.status === 'ANSWERED' && question.answer ? (
              <div className='space-y-3'>
                <Notice icon={CheckCircle2} tone='success'>
                  {t('finance.questions.answeredNotice')}
                </Notice>
                <div className='rounded-xl border border-border p-3 text-xs'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Pill tone={opinionTones[question.answer.opinion]}>
                      {t(`finance.opinion.${question.answer.opinion}`)}
                    </Pill>
                    <span className='text-muted-foreground'>{formatDateTime(question.answer.answeredAt)}</span>
                  </div>
                  <p className='mt-2 text-foreground'>{question.answer.note}</p>
                </div>
              </div>
            ) : question.responderIsApprover ? (
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
                  <legend className='text-xs font-bold text-foreground'>{t('finance.questions.opinionLegend')}</legend>
                  <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                    {t('finance.questions.suggested', { opinion: t(`finance.opinion.${suggested}`) })}
                  </p>
                  <div className='mt-2 grid gap-2'>
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
