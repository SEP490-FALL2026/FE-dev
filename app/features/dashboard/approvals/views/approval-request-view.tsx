import { ArrowLeft, CheckCircle2, ChevronDown, Circle, CircleDot, Info, ShieldCheck, XCircle } from 'lucide-react'
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
  primaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import { approvalQueue, approverSnapshots, requestDetails, type FinanceAnswer } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'
import { AskFinanceDialog, FinanceOpinionPanel, RejectDialog } from './approval-request-parts'
import { SlaBadge } from './approval-queue-view'

type Outcome = { kind: 'approved' } | { kind: 'rejected'; reason: string } | null

const riskTones = { HIGH: 'danger', LOW: 'success', MEDIUM: 'warning' } as const

interface ApprovalRequestViewProps {
  formatCurrency: (value: number) => string
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

function SummaryFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='rounded-xl border border-border bg-surface px-4 py-3 shadow-sm'>
      <p className='text-[0.7rem] font-semibold text-muted-foreground'>{label}</p>
      <div className='mt-1 text-sm font-bold text-foreground'>{value}</div>
    </div>
  )
}

export function ApprovalRequestView({ formatCurrency, itemId, onSelectTab }: ApprovalRequestViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatDateTime } = useDashboardFormat()
  const detail = requestDetails.find((item) => item.id === itemId) ?? requestDetails[0]
  const queueItem = approvalQueue.find((item) => item.id === detail.id) ?? approvalQueue[0]
  const snapshot = approverSnapshots[detail.costCenter]
  const isNeedStep = queueItem.kind === 'NEED_STEP'

  const [financeAnswer, setFinanceAnswer] = useState<FinanceAnswer | undefined>(detail.financeAnswer)
  const [dialog, setDialog] = useState<'ask' | 'reject' | null>(null)
  const [outcome, setOutcome] = useState<Outcome>(null)

  const borneCost = getBorneCost(detail.estimate)
  const remaining = getRemaining(snapshot)
  const remainingAfter = remaining === null ? null : remaining - borneCost

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

      <section aria-label={t('approvals.request.summaryRegion')} className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <SummaryFact label={t('budget.borneCost')} value={formatCurrency(borneCost)} />
        <SummaryFact
          label={t('approvals.request.summaryCostCenter')}
          value={`${detail.costCenter} · ${snapshot.period}`}
        />
        <SummaryFact
          label={t('budget.remaining')}
          value={<RemainingValue formatCurrency={formatCurrency} remaining={remaining} />}
        />
        <SummaryFact
          label={t('approvals.request.summaryRemainingAfter')}
          value={<RemainingValue formatCurrency={formatCurrency} remaining={remainingAfter} />}
        />
      </section>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <Panel>
            <PanelTitle title={t('approvals.request.needTitle')} />
            <div className='mt-3 grid gap-x-6 sm:grid-cols-2'>
              <InfoRow label={t('approvals.request.requester')} value={detail.requester} />
              <InfoRow label={t('approvals.request.beneficiary')} value={detail.beneficiary} />
            </div>
            <p className='mt-3 rounded-xl bg-surface-subtle p-3 text-sm text-foreground'>{detail.justification}</p>

            {detail.itAssessment && (
              <div className='mt-4 flex flex-wrap items-start justify-between gap-2 rounded-xl border border-border p-3 text-xs'>
                <div className='min-w-0 flex-1'>
                  <p className='flex items-center gap-1.5 font-bold'>
                    <ShieldCheck aria-hidden='true' className='size-3.5 text-primary' />
                    {t('approvals.request.itAssessment')}
                  </p>
                  <p className='mt-1 text-muted-foreground'>{detail.itAssessment.summary}</p>
                  <p className='mt-1 font-semibold'>{detail.itAssessment.controlLevel}</p>
                </div>
                <Pill tone={riskTones[detail.itAssessment.risk]}>
                  {t(`approvals.risk.${detail.itAssessment.risk}`)}
                </Pill>
              </div>
            )}
          </Panel>

          <Panel>
            <PanelTitle hint={t('approvals.request.budgetHint')} title={t('approvals.request.budgetTitle')} />
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              <CostEstimatePanel estimate={detail.estimate} formatCurrency={formatCurrency} />
              <BudgetSnapshotPanel formatCurrency={formatCurrency} snapshot={snapshot} />
            </div>
          </Panel>

          <details className='group rounded-2xl border border-border bg-surface p-5 shadow-sm'>
            <summary className='flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold text-foreground'>
              {t('approvals.request.trailTitle')}
              <ChevronDown
                aria-hidden='true'
                className='size-4 text-muted-foreground transition group-open:rotate-180'
              />
            </summary>
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
          </details>
        </div>

        <div className='space-y-6 xl:sticky xl:top-0 xl:self-start'>
          <Panel>
            <PanelTitle
              hint={isNeedStep ? t('approvals.request.needStepHint') : t('approvals.request.spendStepHint')}
              title={isNeedStep ? t('approvals.request.needDecisionTitle') : t('approvals.request.spendDecisionTitle')}
            />

            {outcome?.kind === 'approved' ? (
              <div className='mt-4 space-y-2'>
                <Notice icon={CheckCircle2} tone='success'>
                  {isNeedStep ? t('approvals.request.needApproved') : t('approvals.request.spendApproved')}
                </Notice>
                {!isNeedStep && (
                  <p className='text-[0.7rem] text-muted-foreground'>{t('approvals.request.recordingNote')}</p>
                )}
              </div>
            ) : outcome?.kind === 'rejected' ? (
              <div className='mt-4'>
                <Notice icon={XCircle} tone='danger'>
                  <p>{t('approvals.request.rejected')}</p>
                  <p className='mt-1 italic'>{outcome.reason}</p>
                </Notice>
              </div>
            ) : (
              <div className='mt-4 space-y-3'>
                <div className='grid grid-cols-2 gap-2'>
                  <button
                    className={primaryButtonClassName}
                    onClick={() => setOutcome({ kind: 'approved' })}
                    type='button'
                  >
                    <CheckCircle2 aria-hidden='true' className='size-3.5' />
                    {t('approvals.request.approve')}
                  </button>
                  <button className={dangerButtonClassName} onClick={() => setDialog('reject')} type='button'>
                    <XCircle aria-hidden='true' className='size-3.5' />
                    {t('approvals.request.reject')}
                  </button>
                </div>
                <p className='flex items-start gap-1.5 text-[0.7rem] text-muted-foreground'>
                  <Info aria-hidden='true' className='mt-px size-3.5 shrink-0' />
                  {t('approvals.request.snapshotCaptured')}
                </p>
              </div>
            )}
          </Panel>

          <FinanceOpinionPanel answer={financeAnswer} disabled={outcome !== null} onAsk={() => setDialog('ask')} />
        </div>
      </div>

      {dialog === 'ask' && (
        <AskFinanceDialog
          costCenter={detail.costCenter}
          onClose={() => setDialog(null)}
          onSend={(question) => {
            setFinanceAnswer({ askedAt: new Date().toISOString(), question })
            setDialog(null)
          }}
        />
      )}
      {dialog === 'reject' && (
        <RejectDialog
          onClose={() => setDialog(null)}
          onReject={(reason) => {
            setOutcome({ kind: 'rejected', reason })
            setDialog(null)
          }}
          reference={queueItem.reference}
        />
      )}
    </div>
  )
}
