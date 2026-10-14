import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Info,
  MessageSquareQuote,
  ReceiptText,
  ShieldCheck,
  UsersRound
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  InfoRow,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
  inputClassName,
  primaryButtonClassName,
  useDashboardFormat
} from '../../dashboard-ui'
import { approvalQueue, chargeDetails, costCenterOptions, findingDetails } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'
import { SlaBadge } from './approval-queue-view'

type ChargeOutcome = 'ACCEPT' | 'NOT_ACCEPT'
type FindingOutcome = 'FALSE_POSITIVE' | 'LEGITIMIZE' | 'NOT_APPROVED'
type Outcome = ChargeOutcome | FindingOutcome

const riskTones = { HIGH: 'danger', LOW: 'success', MEDIUM: 'warning' } as const

interface ApprovalChargeViewProps {
  formatCurrency: (value: number) => string
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalChargeView({ formatCurrency, itemId, onSelectTab }: ApprovalChargeViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const queueItem =
    approvalQueue.find((item) => item.id === itemId && (item.kind === 'CHARGE' || item.kind === 'FINDING')) ??
    approvalQueue.find((item) => item.kind === 'CHARGE')!
  const charge = chargeDetails.find((item) => item.id === queueItem.id)
  const finding = findingDetails.find((item) => item.id === queueItem.id)
  const isFinding = queueItem.kind === 'FINDING'

  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [costCenter, setCostCenter] = useState('')
  const [reason, setReason] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [decided, setDecided] = useState(false)

  const outcomes: readonly Outcome[] = isFinding
    ? ['LEGITIMIZE', 'NOT_APPROVED', 'FALSE_POSITIVE']
    : ['ACCEPT', 'NOT_ACCEPT']
  const needsReason = outcome !== null && outcome !== 'ACCEPT' && outcome !== 'LEGITIMIZE'
  const needsCostCenter = outcome === 'ACCEPT'

  const submit = () => {
    if (!outcome || (needsReason && reason.trim().length === 0) || (needsCostCenter && !costCenter)) {
      setShowErrors(true)
      return
    }
    setDecided(true)
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
        code={isFinding ? 'UF-15 · APV-02 · BM-07' : 'UF-15 · APV-02'}
        subtitle={isFinding ? t('approvals.charge.findingSubtitle') : t('approvals.charge.chargeSubtitle')}
        title={`${queueItem.reference} · ${queueItem.software}`}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          {charge && (
            <Panel>
              <PanelTitle
                action={<Pill tone='warning'>{t(`finance.exceptions.reason.${charge.reason}`)}</Pill>}
                title={t('approvals.charge.chargeTitle')}
              />
              <div className='mt-3 divide-y divide-border'>
                <InfoRow label={t('approvals.charge.statementLine')} value={charge.statementLine} />
                <InfoRow label={t('approvals.charge.vendor')} value={charge.vendor} />
                <InfoRow label={t('approvals.charge.date')} value={formatDate(charge.date)} />
                <InfoRow label={t('finance.exceptions.amount')} value={formatCurrency(charge.amount)} />
              </div>
              <p className='mt-4 text-xs font-bold'>{t('finance.exceptions.basisTried')}</p>
              <ul className='mt-2 space-y-1.5 text-xs text-muted-foreground'>
                {charge.basisTried.map((basis) => (
                  <li className='flex items-start gap-1.5' key={basis}>
                    <ReceiptText aria-hidden='true' className='mt-px size-3.5 shrink-0' />
                    {basis}
                  </li>
                ))}
              </ul>
              <div className='mt-4 rounded-xl bg-surface-subtle p-3 text-xs'>
                <p className='font-bold'>{t('approvals.charge.financeEvidence')}</p>
                <p className='mt-1 text-muted-foreground'>{charge.financeNote}</p>
                <ul className='mt-2 space-y-1'>
                  {charge.evidence.map((file) => (
                    <li className='flex items-center gap-1.5 font-mono text-muted-foreground' key={file}>
                      <FileText aria-hidden='true' className='size-3.5' />
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          )}

          {finding && (
            <>
              <Panel>
                <PanelTitle title={t('approvals.charge.findingTitle', { vendor: finding.vendor })} />
                <div className='mt-3 divide-y divide-border'>
                  <InfoRow label={t('approvals.charge.payer')} value={finding.payer} />
                  <InfoRow label={t('approvals.charge.responsible')} value={finding.responsible} />
                  <InfoRow
                    label={t('approvals.charge.chargesTotal', { count: finding.charges.length })}
                    value={formatCurrency(finding.charges.reduce((sum, item) => sum + item.amount, 0))}
                  />
                </div>
                <p className='mt-4 flex items-center gap-1.5 text-xs font-bold'>
                  <UsersRound aria-hidden='true' className='size-3.5' />
                  {t('approvals.charge.users', { count: finding.users.length })}
                </p>
                <div className='mt-2 flex flex-wrap gap-1.5'>
                  {finding.users.map((user) => (
                    <Pill key={user}>{user}</Pill>
                  ))}
                </div>
                <ul className='mt-4 divide-y divide-border text-xs'>
                  {finding.charges.map((item) => (
                    <li className='flex justify-between gap-2 py-1.5' key={item.date}>
                      <span className='text-muted-foreground'>
                        {formatDate(item.date)} · {item.line}
                      </span>
                      <span className='font-semibold'>{formatCurrency(item.amount)}</span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel>
                <PanelTitle
                  action={
                    <Pill tone={riskTones[finding.assessment.risk]}>
                      {t(`approvals.risk.${finding.assessment.risk}`)}
                    </Pill>
                  }
                  hint={t('approvals.charge.assessmentHint')}
                  title={t('approvals.charge.assessmentTitle')}
                />
                <div className='mt-3 space-y-2 text-xs'>
                  <p className='flex items-start gap-1.5'>
                    <ShieldCheck aria-hidden='true' className='mt-px size-3.5 shrink-0 text-primary' />
                    <span>
                      <span className='font-bold'>{t('approvals.charge.control')}: </span>
                      {finding.assessment.control}
                    </span>
                  </p>
                  <p className='text-muted-foreground'>{finding.assessment.technical}</p>
                </div>
              </Panel>

              <Panel>
                <PanelTitle hint={t('approvals.charge.headContextHint')} title={t('approvals.charge.headContext')} />
                <p className='mt-3 flex items-start gap-2 text-sm'>
                  <MessageSquareQuote aria-hidden='true' className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
                  {finding.headContext ?? t('approvals.charge.noHeadContext')}
                </p>
              </Panel>
            </>
          )}
        </div>

        <Panel className='h-fit'>
          <PanelTitle hint={t('approvals.charge.decisionHint')} title={t('approvals.charge.decisionTitle')} />
          {decided && outcome ? (
            <div className='mt-4'>
              <Notice
                icon={CheckCircle2}
                tone={outcome === 'ACCEPT' || outcome === 'LEGITIMIZE' ? 'success' : 'neutral'}
              >
                <p>{t(`approvals.charge.result.${outcome}`, { costCenter })}</p>
                {reason && <p className='mt-1 italic'>{reason}</p>}
              </Notice>
            </div>
          ) : (
            <form
              className='mt-4 space-y-4'
              onSubmit={(event) => {
                event.preventDefault()
                submit()
              }}
            >
              <fieldset className='space-y-2'>
                <legend className='sr-only'>{t('approvals.charge.decisionTitle')}</legend>
                {outcomes.map((value) => (
                  <label
                    className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-xs transition ${
                      outcome === value ? 'border-primary bg-primary-soft/40' : 'border-border hover:border-primary/40'
                    }`}
                    key={value}
                  >
                    <input
                      checked={outcome === value}
                      className='mt-0.5 accent-primary'
                      name='charge-outcome'
                      onChange={() => {
                        setOutcome(value)
                        setShowErrors(false)
                      }}
                      type='radio'
                    />
                    <span>
                      <span className='block font-bold'>{t(`approvals.charge.outcome.${value}`)}</span>
                      <span className='text-muted-foreground'>{t(`approvals.charge.outcomeHint.${value}`)}</span>
                    </span>
                  </label>
                ))}
                {showErrors && !outcome && (
                  <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
                    {t('approvals.renewal.actionRequired')}
                  </p>
                )}
              </fieldset>

              {needsCostCenter && (
                <div>
                  <label className='text-xs font-bold' htmlFor='charge-cost-center'>
                    {t('approvals.charge.costCenterLabel')}
                  </label>
                  <select
                    className={`${inputClassName} mt-2`}
                    id='charge-cost-center'
                    onChange={(event) => setCostCenter(event.target.value)}
                    value={costCenter}
                  >
                    <option value=''>{t('finance.close.pickCostCenter')}</option>
                    {costCenterOptions.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  {showErrors && !costCenter && (
                    <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                      {t('approvals.charge.costCenterRequired')}
                    </p>
                  )}
                </div>
              )}

              {needsReason && (
                <div>
                  <label className='text-xs font-bold' htmlFor='charge-reason'>
                    {t('approvals.charge.reasonLabel')}
                  </label>
                  <textarea
                    className={`${inputClassName} mt-2 min-h-20`}
                    id='charge-reason'
                    onChange={(event) => setReason(event.target.value)}
                    value={reason}
                  />
                  {showErrors && reason.trim().length === 0 && (
                    <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                      {t('approvals.reasonRequired')}
                    </p>
                  )}
                </div>
              )}

              <button className={`${primaryButtonClassName} w-full`} type='submit'>
                <CheckCircle2 aria-hidden='true' className='size-3.5' />
                {t('approvals.charge.submit')}
              </button>
              <p className='flex items-start gap-1.5 text-[0.7rem] text-muted-foreground'>
                <Info aria-hidden='true' className='mt-px size-3.5 shrink-0' />
                {t('approvals.charge.executionNote')}
              </p>
            </form>
          )}
        </Panel>
      </div>
    </div>
  )
}
