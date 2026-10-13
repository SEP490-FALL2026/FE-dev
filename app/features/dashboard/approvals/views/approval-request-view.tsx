import { ArrowLeft, CheckCircle2, Circle, CircleDot, Info, MessageSquareText, ShieldCheck, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BudgetSnapshotPanel, CostEstimatePanel } from '../../budget-figures'
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
import { approvalQueue, approverSnapshots, requestDetails, type FinanceAnswer } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'
import { SlaBadge } from './approval-queue-view'

type Outcome = 'approved' | 'rejected' | null

const opinionTones: Record<NonNullable<FinanceAnswer['opinion']>, Tone> = {
  NO_BUDGET: 'warning',
  OVER: 'danger',
  WITHIN: 'success'
}
const riskTones = { HIGH: 'danger', LOW: 'success', MEDIUM: 'warning' } as const

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

  const [financeAnswer, setFinanceAnswer] = useState<FinanceAnswer | undefined>(detail.financeAnswer)
  const [askOpen, setAskOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [showReasonError, setShowReasonError] = useState(false)
  const [outcome, setOutcome] = useState<Outcome>(null)

  const askFinance = () => {
    setFinanceAnswer({ askedAt: new Date().toISOString() })
    setAskOpen(false)
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
        subtitle={`${queueItem.reference} · ${t(`approvals.kind.${queueItem.kind}`)}`}
        title={queueItem.software}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <Panel>
            <PanelTitle
              action={<Pill tone='primary'>{t(`approvals.request.branch.${detail.branch}`)}</Pill>}
              title={t('approvals.request.needTitle')}
            />
            <div className='mt-3 divide-y divide-border'>
              <InfoRow label={t('approvals.request.requester')} value={detail.requester} />
              <InfoRow label={t('approvals.request.beneficiary')} value={detail.beneficiary} />
              <InfoRow label={t('budget.costCenter')} value={`${detail.costCenter} · ${snapshot.period}`} />
            </div>
            <p className='mt-3 rounded-xl bg-surface-subtle p-3 text-sm text-foreground'>{detail.justification}</p>

            {detail.itAssessment && (
              <div className='mt-4 rounded-xl border border-border p-3 text-xs'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='flex items-center gap-1.5 font-bold'>
                    <ShieldCheck aria-hidden='true' className='size-3.5 text-primary' />
                    {t('approvals.request.itAssessment')}
                  </p>
                  <Pill tone={riskTones[detail.itAssessment.risk]}>
                    {t(`approvals.risk.${detail.itAssessment.risk}`)}
                  </Pill>
                </div>
                <p className='mt-2 text-muted-foreground'>{detail.itAssessment.summary}</p>
                <p className='mt-1 font-semibold'>{detail.itAssessment.controlLevel}</p>
              </div>
            )}
          </Panel>

          <Panel>
            <PanelTitle title={t('approvals.request.trailTitle')} />
            <ol className='mt-4 space-y-3'>
              {detail.trail.map((step) => {
                const Icon = step.status === 'done' ? CheckCircle2 : step.status === 'current' ? CircleDot : Circle

                return (
                  <li className='flex items-start gap-3 text-xs' key={step.key}>
                    <Icon
                      aria-hidden='true'
                      className={`mt-0.5 size-4 shrink-0 ${
                        step.status === 'done'
                          ? 'text-success'
                          : step.status === 'current'
                            ? 'text-primary'
                            : 'text-muted-foreground'
                      }`}
                    />
                    <div className='min-w-0'>
                      <p className='font-bold text-foreground'>
                        {t(`approvals.request.step.${step.key}`)}
                        {step.status === 'current' && (
                          <span className='ml-2 text-primary'>{t('approvals.request.yourStep')}</span>
                        )}
                      </p>
                      <p className='text-muted-foreground'>
                        {step.actor}
                        {step.at && ` · ${formatDateTime(step.at)}`}
                      </p>
                      {step.sameAsApprover && (
                        <p className='mt-0.5'>
                          <Pill tone='info'>{t('approvals.request.samePerson')}</Pill>
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </Panel>

          <CostEstimatePanel estimate={detail.estimate} formatCurrency={formatCurrency} />
        </div>

        <div className='space-y-6'>
          <BudgetSnapshotPanel formatCurrency={formatCurrency} snapshot={snapshot} />

          <Panel>
            <PanelTitle hint={t('approvals.request.financeHint')} title={t('approvals.request.financeTitle')} />
            <div className='mt-3'>
              {financeAnswer?.opinion ? (
                <div className='space-y-2 text-xs'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Pill tone={opinionTones[financeAnswer.opinion]}>
                      {t(`finance.opinion.${financeAnswer.opinion}`)}
                    </Pill>
                    {financeAnswer.answeredAt && (
                      <span className='text-muted-foreground'>{formatDateTime(financeAnswer.answeredAt)}</span>
                    )}
                  </div>
                  <p className='text-foreground'>{financeAnswer.note}</p>
                  <p className='text-[0.7rem] text-muted-foreground'>{t('approvals.request.referenceOnly')}</p>
                </div>
              ) : financeAnswer ? (
                <Notice icon={MessageSquareText} tone='info'>
                  {t('approvals.request.financePending', { time: formatDateTime(financeAnswer.askedAt) })}
                </Notice>
              ) : askOpen ? (
                <form
                  className='space-y-2'
                  onSubmit={(event) => {
                    event.preventDefault()
                    askFinance()
                  }}
                >
                  <label className='text-xs font-bold' htmlFor='finance-question'>
                    {t('approvals.request.questionLabel')}
                  </label>
                  <textarea
                    className={`${inputClassName} min-h-20`}
                    id='finance-question'
                    onChange={(event) => setQuestion(event.target.value)}
                    value={question}
                  />
                  <div className='flex gap-2'>
                    <button className={primaryButtonClassName} type='submit'>
                      {t('approvals.request.sendQuestion')}
                    </button>
                    <button className={secondaryButtonClassName} onClick={() => setAskOpen(false)} type='button'>
                      {t('ui.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className={secondaryButtonClassName}
                  disabled={outcome !== null}
                  onClick={() => setAskOpen(true)}
                  type='button'
                >
                  <MessageSquareText aria-hidden='true' className='size-3.5' />
                  {t('approvals.request.askFinance')}
                </button>
              )}
            </div>
          </Panel>

          <Panel>
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
                  <button
                    className={primaryButtonClassName}
                    disabled={rejecting}
                    onClick={() => setOutcome('approved')}
                    type='button'
                  >
                    <CheckCircle2 aria-hidden='true' className='size-3.5' />
                    {t('approvals.request.approve')}
                  </button>
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
        </div>
      </div>
    </div>
  )
}
