import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Info,
  MessageSquarePlus,
  MessageSquareText,
  Send,
  ShieldCheck,
  XCircle
} from 'lucide-react'
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
  InfoRow,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  dangerButtonClassName,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  useDashboardFormat,
  type Tone
} from '../../dashboard-ui'
import {
  approvalQueue,
  approverSnapshots,
  requestDetails,
  type FinanceAnswer,
  type FinanceTopic,
  type FinanceUrgency
} from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'
import { SlaBadge } from './approval-queue-view'

type Outcome = 'approved' | 'rejected' | null

const opinionTones: Record<NonNullable<FinanceAnswer['opinion']>, Tone> = {
  NO_BUDGET: 'warning',
  OVER: 'danger',
  WITHIN: 'success'
}
const riskTones = { HIGH: 'danger', LOW: 'success', MEDIUM: 'warning' } as const
const financeTopics: readonly FinanceTopic[] = ['ENOUGH_BUDGET', 'PENDING_IMPACT', 'BUDGET_TIMING', 'SUGGESTION']
const urgencies: readonly FinanceUrgency[] = ['BEFORE_SLA', 'TODAY', 'NOT_URGENT']

function KeyFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='min-w-0 rounded-xl border border-border bg-surface px-4 py-3'>
      <p className='truncate text-[0.7rem] font-semibold text-muted-foreground'>{label}</p>
      <div className='mt-1 truncate text-base font-extrabold text-foreground'>{value}</div>
    </div>
  )
}

interface ApprovalRequestViewProps {
  formatCurrency: (value: number) => string
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalRequestView({ formatCurrency, itemId, onSelectTab }: ApprovalRequestViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime } = useDashboardFormat()
  const detail = requestDetails.find((item) => item.id === itemId) ?? requestDetails[0]
  const queueItem = approvalQueue.find((item) => item.id === detail.id) ?? approvalQueue[0]
  const snapshot = approverSnapshots[detail.costCenter]
  const isNeedStep = queueItem.kind === 'NEED_STEP'
  const borneCost = getBorneCost(detail.estimate)
  const remaining = getRemaining(snapshot)
  const remainingAfter = remaining === null ? null : remaining - borneCost

  // Finance budget thread: earlier questions plus anything asked on this screen.
  const [thread, setThread] = useState<FinanceAnswer[]>(detail.financeAnswer ? [detail.financeAnswer] : [])
  const [formOpen, setFormOpen] = useState(thread.length === 0)
  const [topics, setTopics] = useState<FinanceTopic[]>(['ENOUGH_BUDGET'])
  const [question, setQuestion] = useState('')
  const [urgency, setUrgency] = useState<FinanceUrgency>('BEFORE_SLA')
  const [showQuestionError, setShowQuestionError] = useState(false)

  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [showReasonError, setShowReasonError] = useState(false)
  const [outcome, setOutcome] = useState<Outcome>(null)

  const toggleTopic = (topic: FinanceTopic) =>
    setTopics((current) => (current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]))

  const sendQuestion = () => {
    if (question.trim().length === 0) {
      setShowQuestionError(true)
      return
    }
    setThread((current) => [
      ...current,
      { askedAt: new Date().toISOString(), question: question.trim(), topics, urgency }
    ])
    setQuestion('')
    setTopics(['ENOUGH_BUDGET'])
    setUrgency('BEFORE_SLA')
    setShowQuestionError(false)
    setFormOpen(false)
  }

  const reject = () => {
    if (reason.trim().length === 0) {
      setShowReasonError(true)
      return
    }
    setOutcome('rejected')
  }

  return (
    <div className='space-y-6'>
      <button
        className='inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground'
        onClick={() => onSelectTab('queue')}
        type='button'
      >
        <ArrowLeft aria-hidden='true' className='size-4' />
        {t('approvals.backToQueue')}
      </button>

      <PageHeader
        actions={<SlaBadge item={queueItem} />}
        code='UF-15 · APV-02'
        subtitle={`${queueItem.reference} · ${t(`approvals.kind.${queueItem.kind}`)} · ${t(`approvals.request.branch.${detail.branch}`)}`}
        title={queueItem.software}
      />

      <section aria-label={t('approvals.request.summaryLabel')} className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <KeyFact label={t('approvals.request.fact.cost')} value={formatCurrency(borneCost)} />
        <KeyFact label={t('approvals.request.fact.costCenter')} value={`${detail.costCenter} · ${snapshot.period}`} />
        <KeyFact
          label={t('approvals.request.fact.remainingAfter')}
          value={<RemainingValue formatCurrency={formatCurrency} remaining={remainingAfter} />}
        />
        <KeyFact label={t('approvals.request.requester')} value={detail.requester} />
      </section>

      <ol
        aria-label={t('approvals.request.trailTitle')}
        className='flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-xs'
      >
        {detail.trail.map((step, index) => (
          <li className='flex items-center gap-2' key={step.key}>
            {index > 0 && <span aria-hidden='true' className='h-px w-6 bg-border' />}
            <span
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold ${
                step.status === 'done'
                  ? 'border-success/30 bg-success/10 text-success'
                  : step.status === 'current'
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-border text-muted-foreground'
              }`}
              title={step.at ? `${step.actor} · ${formatDateTime(step.at)}` : step.actor}
            >
              {step.status === 'done' && <Check aria-hidden='true' className='size-3' />}
              {t(`approvals.request.step.${step.key}`)}
              {step.sameAsApprover && <span className='font-normal'>· {t('approvals.request.samePerson')}</span>}
            </span>
          </li>
        ))}
      </ol>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <Panel>
            <PanelTitle title={t('approvals.request.needTitle')} />
            <p className='mt-3 text-sm leading-relaxed text-foreground'>{detail.justification}</p>
            <div className='mt-3 grid gap-x-6 border-t border-border pt-2 sm:grid-cols-2'>
              <InfoRow label={t('approvals.request.requester')} value={detail.requester} />
              <InfoRow label={t('approvals.request.beneficiary')} value={detail.beneficiary} />
            </div>
            {detail.itAssessment && (
              <div className='mt-3 flex items-start gap-3 rounded-xl bg-surface-subtle p-3 text-xs'>
                <ShieldCheck aria-hidden='true' className='mt-0.5 size-4 shrink-0 text-primary' />
                <div className='min-w-0 space-y-1'>
                  <p className='flex flex-wrap items-center gap-2 font-bold'>
                    {t('approvals.request.itAssessment')}
                    <Pill tone={riskTones[detail.itAssessment.risk]}>
                      {t(`approvals.risk.${detail.itAssessment.risk}`)}
                    </Pill>
                  </p>
                  <p className='text-muted-foreground'>{detail.itAssessment.summary}</p>
                  <p className='font-semibold'>{detail.itAssessment.controlLevel}</p>
                </div>
              </div>
            )}
          </Panel>

          <Panel>
            <PanelTitle hint={t('budget.borneCostNote')} title={t('approvals.request.costTitle')} />
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              <CostEstimatePanel estimate={detail.estimate} formatCurrency={formatCurrency} />
              <BudgetSnapshotPanel formatCurrency={formatCurrency} snapshot={snapshot} />
            </div>
          </Panel>
        </div>

        <div className='space-y-6 xl:sticky xl:top-24 xl:self-start'>
          <Panel className='border-primary/40'>
            <PanelTitle
              hint={isNeedStep ? t('approvals.request.needStepHint') : t('approvals.request.spendStepHint')}
              title={isNeedStep ? t('approvals.request.needDecisionTitle') : t('approvals.request.spendDecisionTitle')}
            />

            {outcome === 'approved' ? (
              <div className='mt-4'>
                <Notice icon={CheckCircle2} tone='success'>
                  {isNeedStep ? t('approvals.request.needApproved') : t('approvals.request.spendApproved')}
                </Notice>
              </div>
            ) : outcome === 'rejected' ? (
              <div className='mt-4'>
                <Notice icon={XCircle} tone='danger'>
                  <p>{t('approvals.request.rejected')}</p>
                  <p className='mt-1 italic'>{reason}</p>
                </Notice>
              </div>
            ) : (
              <div className='mt-4 space-y-3'>
                {rejecting && (
                  <div>
                    <label className='text-xs font-bold' htmlFor='reject-reason'>
                      {t('approvals.request.rejectReason')}
                    </label>
                    <textarea
                      className={`${inputClassName} mt-2 min-h-20`}
                      id='reject-reason'
                      onChange={(event) => setReason(event.target.value)}
                      value={reason}
                    />
                    {showReasonError && (
                      <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                        {t('approvals.reasonRequired')}
                      </p>
                    )}
                  </div>
                )}
                <div className='grid grid-cols-2 gap-2'>
                  {rejecting ? (
                    <button className={secondaryButtonClassName} onClick={() => setRejecting(false)} type='button'>
                      {t('ui.cancel')}
                    </button>
                  ) : (
                    <button className={primaryButtonClassName} onClick={() => setOutcome('approved')} type='button'>
                      <CheckCircle2 aria-hidden='true' className='size-3.5' />
                      {t('approvals.request.approve')}
                    </button>
                  )}
                  <button
                    className={dangerButtonClassName}
                    onClick={() => (rejecting ? reject() : setRejecting(true))}
                    type='button'
                  >
                    <XCircle aria-hidden='true' className='size-3.5' />
                    {rejecting ? t('approvals.request.confirmReject') : t('approvals.request.reject')}
                  </button>
                </div>
                <p className='flex items-start gap-1.5 text-[0.7rem] text-muted-foreground'>
                  <Info aria-hidden='true' className='mt-px size-3.5 shrink-0' />
                  {t('approvals.request.snapshotCaptured')}
                </p>
              </div>
            )}
          </Panel>

          <Panel>
            <PanelTitle hint={t('approvals.request.financeHint')} title={t('approvals.request.financeTitle')} />

            {thread.length > 0 && (
              <ol className='mt-4 space-y-3'>
                {thread.map((entry) => (
                  <li className='space-y-2' key={entry.askedAt}>
                    <div className='rounded-xl border border-border bg-background p-3 text-xs'>
                      <p className='flex items-center justify-between gap-2 text-[0.7rem] text-muted-foreground'>
                        <span className='font-bold text-foreground'>{t('approvals.request.you')}</span>
                        {formatDateTime(entry.askedAt)}
                      </p>
                      <div className='mt-1.5 flex flex-wrap gap-1'>
                        {entry.topics.map((topic) => (
                          <Pill key={topic} tone='info'>
                            {t(`approvals.request.topic.${topic}`)}
                          </Pill>
                        ))}
                        <Pill>{t(`approvals.request.urgency.${entry.urgency}`)}</Pill>
                      </div>
                      <p className='mt-2 text-foreground'>{entry.question}</p>
                    </div>

                    {entry.opinion ? (
                      <div className='ml-4 rounded-xl border border-border bg-surface-subtle p-3 text-xs'>
                        <p className='flex items-center justify-between gap-2 text-[0.7rem] text-muted-foreground'>
                          <span className='font-bold text-foreground'>{t('approvals.request.financeName')}</span>
                          {entry.answeredAt && formatDateTime(entry.answeredAt)}
                        </p>
                        <p className='mt-1.5'>
                          <Pill tone={opinionTones[entry.opinion]}>{t(`finance.opinion.${entry.opinion}`)}</Pill>
                        </p>
                        <p className='mt-2 text-foreground'>{entry.note}</p>
                      </div>
                    ) : (
                      <p className='ml-4 flex items-center gap-1.5 text-[0.7rem] text-info'>
                        <MessageSquareText aria-hidden='true' className='size-3.5' />
                        {t('approvals.request.financePending')}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}

            {thread.some((entry) => entry.opinion) && (
              <p className='mt-3 text-[0.7rem] text-muted-foreground'>{t('approvals.request.referenceOnly')}</p>
            )}

            {formOpen && outcome === null ? (
              <form
                className='mt-4 space-y-4 border-t border-border pt-4'
                onSubmit={(event) => {
                  event.preventDefault()
                  sendQuestion()
                }}
              >
                <fieldset>
                  <legend className='text-xs font-bold'>{t('approvals.request.topicLegend')}</legend>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {financeTopics.map((topic) => {
                      const checked = topics.includes(topic)

                      return (
                        <label
                          className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                            checked
                              ? 'border-primary bg-primary-soft/50 text-primary'
                              : 'border-border text-muted-foreground'
                          }`}
                          key={topic}
                        >
                          <input
                            checked={checked}
                            className='sr-only'
                            onChange={() => toggleTopic(topic)}
                            type='checkbox'
                          />
                          {checked && <Check aria-hidden='true' className='size-3' />}
                          {t(`approvals.request.topic.${topic}`)}
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <div>
                  <label className='text-xs font-bold' htmlFor='finance-question'>
                    {t('approvals.request.questionLabel')}
                  </label>
                  <textarea
                    className={`${inputClassName} mt-2 min-h-24`}
                    id='finance-question'
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder={t('approvals.request.questionPlaceholder')}
                    value={question}
                  />
                  {showQuestionError && (
                    <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                      {t('approvals.request.questionRequired')}
                    </p>
                  )}
                </div>

                <div>
                  <label className='text-xs font-bold' htmlFor='finance-urgency'>
                    {t('approvals.request.urgencyLabel')}
                  </label>
                  <select
                    className={`${inputClassName} mt-2`}
                    id='finance-urgency'
                    onChange={(event) => setUrgency(event.target.value as FinanceUrgency)}
                    value={urgency}
                  >
                    {urgencies.map((value) => (
                      <option key={value} value={value}>
                        {t(`approvals.request.urgency.${value}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <button className={primaryButtonClassName} type='submit'>
                    <Send aria-hidden='true' className='size-3.5' />
                    {t('approvals.request.sendQuestion')}
                  </button>
                  {thread.length > 0 && (
                    <button className={secondaryButtonClassName} onClick={() => setFormOpen(false)} type='button'>
                      {t('ui.cancel')}
                    </button>
                  )}
                </div>
                <p className='text-[0.7rem] text-muted-foreground'>{t('approvals.request.slaNotPaused')}</p>
              </form>
            ) : (
              outcome === null && (
                <button
                  className={`${secondaryButtonClassName} mt-4 w-full`}
                  onClick={() => setFormOpen(true)}
                  type='button'
                >
                  <MessageSquarePlus aria-hidden='true' className='size-3.5' />
                  {t('approvals.request.askMore')}
                </button>
              )
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
