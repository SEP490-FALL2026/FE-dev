import { ArrowLeft, CalendarClock, CheckCircle2, Info, Lightbulb, MessageSquareQuote } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BudgetSnapshotPanel } from '../../budget-figures'
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
import { approvalQueue, approverNow, approverSnapshots, renewalDetails, type RenewalDetail } from '../approvals-data'
import type { ApprovalTabKey } from '../approvals-nav'
import { SlaBadge } from './approval-queue-view'

type RenewalAction = RenewalDetail['itProposal']['action']

const usageStates = [
  { key: 'active', tone: 'bg-success' },
  { key: 'inactive', tone: 'bg-danger' },
  { key: 'noData', tone: 'bg-muted-foreground/40' },
  { key: 'unmatched', tone: 'bg-warning' }
] as const

interface ApprovalRenewalViewProps {
  formatCurrency: (value: number) => string
  itemId?: string
  onSelectTab: (tab: ApprovalTabKey, params?: Record<string, string>) => void
}

export function ApprovalRenewalView({ formatCurrency, itemId, onSelectTab }: ApprovalRenewalViewProps) {
  const { t } = useTranslation('dashboard')
  const { formatDate } = useDashboardFormat()
  const detail = renewalDetails.find((item) => item.id === itemId) ?? renewalDetails[0]
  const queueItem = approvalQueue.find((item) => item.id === detail.id) ?? approvalQueue[0]
  const snapshot = approverSnapshots[detail.costCenter]

  const [action, setAction] = useState<RenewalAction | null>(null)
  const [quantity, setQuantity] = useState(String(detail.itProposal.quantity))
  const [reason, setReason] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [showErrors, setShowErrors] = useState(false)
  const [decided, setDecided] = useState(false)

  const parsedQuantity = Number(quantity.replace(/\D/g, ''))
  const targetQuantity = action === 'CANCEL' ? 0 : action === 'RENEW' ? detail.purchased : parsedQuantity
  const seatsToReclaim = action === 'REDUCE' ? Math.max(0, detail.assigned - parsedQuantity) : 0
  const differsFromIt =
    action !== null &&
    (action !== detail.itProposal.action || (action === 'REDUCE' && parsedQuantity !== detail.itProposal.quantity))
  const daysToDeadline = Math.ceil(
    (new Date(`${detail.cancellationDeadline}T23:59:59+07:00`).getTime() - new Date(approverNow).getTime()) / 86_400_000
  )
  const perSeat = detail.annualCost / detail.purchased
  const usageTotal = Object.values(detail.usage).reduce((sum, value) => sum + value, 0)

  const chooseAction = (value: RenewalAction) => {
    setAction(value)
    setShowErrors(false)
    if (value === 'REDUCE') {
      const needed = Math.max(0, detail.assigned - parsedQuantity)
      setPicked(detail.reclaimCandidates.slice(0, needed).map((candidate) => candidate.id))
    }
  }

  const changeQuantity = (value: string) => {
    setQuantity(value)
    const needed = Math.max(0, detail.assigned - Number(value.replace(/\D/g, '')))
    setPicked(detail.reclaimCandidates.slice(0, needed).map((candidate) => candidate.id))
  }

  const togglePick = (id: string) =>
    setPicked((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))

  const quantityInvalid = action === 'REDUCE' && (parsedQuantity <= 0 || parsedQuantity >= detail.purchased)
  const pickInvalid = action === 'REDUCE' && seatsToReclaim > 0 && picked.length !== seatsToReclaim
  const reasonInvalid = differsFromIt && reason.trim().length === 0

  const submit = () => {
    if (!action || quantityInvalid || pickInvalid || reasonInvalid) {
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
        code='UF-15 · APV-03'
        subtitle={`${queueItem.reference} · ${detail.vendor}`}
        title={t('approvals.renewal.title', { software: queueItem.software })}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <Panel>
            <PanelTitle
              action={
                <Pill tone={daysToDeadline <= 7 ? 'danger' : 'warning'}>
                  <CalendarClock aria-hidden='true' className='size-3' />
                  {t('approvals.renewal.daysLeft', { count: daysToDeadline })}
                </Pill>
              }
              title={t('approvals.renewal.contractTitle')}
            />
            <div className='mt-3 grid gap-x-6 sm:grid-cols-2'>
              <InfoRow label={t('approvals.renewal.deadline')} value={formatDate(detail.cancellationDeadline)} />
              <InfoRow label={t('approvals.renewal.renewalDate')} value={formatDate(detail.renewalDate)} />
              <InfoRow label={t('approvals.renewal.purchased')} value={detail.purchased} />
              <InfoRow label={t('approvals.renewal.assigned')} value={detail.assigned} />
              <InfoRow label={t('approvals.renewal.annualCost')} value={formatCurrency(detail.annualCost)} />
              <InfoRow label={t('budget.costCenter')} value={detail.costCenter} />
            </div>
          </Panel>

          <Panel>
            <PanelTitle hint={t('approvals.renewal.usageHint')} title={t('approvals.renewal.usageTitle')} />
            <div
              aria-label={t('approvals.renewal.usageTitle')}
              className='mt-4 flex h-3 overflow-hidden rounded-full bg-surface-subtle'
              role='img'
            >
              {usageStates.map((state) => (
                <div
                  className={state.tone}
                  key={state.key}
                  style={{ width: `${(detail.usage[state.key] / usageTotal) * 100}%` }}
                />
              ))}
            </div>
            <ul className='mt-3 grid gap-2 text-xs sm:grid-cols-2'>
              {usageStates.map((state) => (
                <li className='flex items-center justify-between gap-2' key={state.key}>
                  <span className='flex items-center gap-2 text-muted-foreground'>
                    <span className={`size-2.5 rounded-full ${state.tone}`} />
                    {t(`approvals.renewal.usage.${state.key}`)}
                  </span>
                  <span className='font-bold'>{detail.usage[state.key]}</span>
                </li>
              ))}
            </ul>
            <div className='mt-4 grid grid-cols-4 gap-2 text-center text-xs'>
              {(['g1', 'g2', 'g3', 'g4'] as const).map((group) => (
                <div className='rounded-xl border border-border p-2' key={group}>
                  <p className='font-mono font-bold text-muted-foreground'>{group.toUpperCase()}</p>
                  <p className='mt-1 text-base font-extrabold'>{detail.waste[group]}</p>
                  <p className='text-[0.65rem] text-muted-foreground'>{t(`approvals.renewal.waste.${group}`)}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelTitle title={t('approvals.renewal.ownerOpinion')} />
            <p className='mt-3 flex items-start gap-2 text-sm text-foreground'>
              <MessageSquareQuote aria-hidden='true' className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
              {detail.businessOwnerOpinion}
            </p>
          </Panel>
        </div>

        <div className='space-y-6'>
          <Panel className='border-primary/30'>
            <PanelTitle title={t('approvals.renewal.itProposal')} />
            <div className='mt-3 flex items-center gap-2'>
              <Lightbulb aria-hidden='true' className='size-4 text-primary' />
              <span className='text-sm font-bold'>
                {t(`approvals.renewal.action.${detail.itProposal.action}`)}
                {detail.itProposal.action === 'REDUCE' && ` → ${detail.itProposal.quantity}`}
              </span>
            </div>
            <p className='mt-2 text-xs text-muted-foreground'>{detail.itProposal.rationale}</p>
          </Panel>

          {snapshot && <BudgetSnapshotPanel formatCurrency={formatCurrency} snapshot={snapshot} />}
          <p className='-mt-4 text-[0.7rem] text-muted-foreground'>{t('approvals.renewal.noCommitment')}</p>

          <Panel>
            <PanelTitle title={t('approvals.renewal.decisionTitle')} />
            {decided ? (
              <div className='mt-4'>
                <Notice icon={CheckCircle2} tone='success'>
                  <p>
                    {t('approvals.renewal.decided', {
                      action: t(`approvals.renewal.action.${action ?? 'RENEW'}`),
                      quantity: targetQuantity
                    })}
                  </p>
                  {daysToDeadline < 0 && <p className='mt-1'>{t('approvals.renewal.lateNote')}</p>}
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
                  <legend className='sr-only'>{t('approvals.renewal.decisionTitle')}</legend>
                  {(['RENEW', 'REDUCE', 'CANCEL'] as const).map((value) => (
                    <label
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                        action === value ? 'border-primary bg-primary-soft/40' : 'border-border hover:border-primary/40'
                      }`}
                      key={value}
                    >
                      <input
                        checked={action === value}
                        className='accent-primary'
                        name='renewal-action'
                        onChange={() => chooseAction(value)}
                        type='radio'
                      />
                      <span className='flex-1'>{t(`approvals.renewal.action.${value}`)}</span>
                      {value === detail.itProposal.action && (
                        <Pill tone='primary'>{t('approvals.renewal.itPick')}</Pill>
                      )}
                    </label>
                  ))}
                  {showErrors && !action && (
                    <p className='text-[0.7rem] font-semibold text-danger' role='alert'>
                      {t('approvals.renewal.actionRequired')}
                    </p>
                  )}
                </fieldset>

                {action === 'REDUCE' && (
                  <div className='space-y-3 rounded-xl border border-border bg-background p-3'>
                    <div>
                      <label className='text-xs font-bold' htmlFor='renewal-quantity'>
                        {t('approvals.renewal.newQuantity', { purchased: detail.purchased })}
                      </label>
                      <input
                        className={`${inputClassName} mt-1`}
                        id='renewal-quantity'
                        inputMode='numeric'
                        onChange={(event) => changeQuantity(event.target.value)}
                        value={quantity}
                      />
                      {showErrors && quantityInvalid && (
                        <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                          {t('approvals.renewal.quantityInvalid', { purchased: detail.purchased })}
                        </p>
                      )}
                      {!quantityInvalid && (
                        <p className='mt-1 text-[0.7rem] text-success'>
                          {t('approvals.renewal.annualSaving', {
                            amount: formatCurrency((detail.purchased - parsedQuantity) * perSeat)
                          })}
                        </p>
                      )}
                    </div>

                    {seatsToReclaim > 0 && !quantityInvalid && (
                      <fieldset>
                        <legend className='text-xs font-bold'>
                          {t('approvals.renewal.reclaimTitle', { count: seatsToReclaim })}
                        </legend>
                        <p className='mt-0.5 text-[0.7rem] text-muted-foreground'>
                          {t('approvals.renewal.reclaimHint')}
                        </p>
                        <ul className='mt-2 space-y-1.5'>
                          {detail.reclaimCandidates.map((candidate, index) => (
                            <li key={candidate.id}>
                              <label className='flex cursor-pointer items-center gap-2 text-xs'>
                                <input
                                  checked={picked.includes(candidate.id)}
                                  className='accent-primary'
                                  onChange={() => togglePick(candidate.id)}
                                  type='checkbox'
                                />
                                <span className='w-4 text-muted-foreground'>{index + 1}</span>
                                <span className='flex-1 font-semibold'>{candidate.name}</span>
                                <Pill>{t(`approvals.renewal.group.${candidate.group}`)}</Pill>
                              </label>
                            </li>
                          ))}
                        </ul>
                        {showErrors && pickInvalid && (
                          <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                            {t('approvals.renewal.pickInvalid', { count: seatsToReclaim })}
                          </p>
                        )}
                      </fieldset>
                    )}
                  </div>
                )}

                {differsFromIt && (
                  <div>
                    <label className='text-xs font-bold' htmlFor='renewal-reason'>
                      {t('approvals.renewal.reasonLabel')}
                    </label>
                    <textarea
                      className={`${inputClassName} mt-2 min-h-20`}
                      id='renewal-reason'
                      onChange={(event) => setReason(event.target.value)}
                      value={reason}
                    />
                    {showErrors && reasonInvalid && (
                      <p className='mt-1 text-[0.7rem] font-semibold text-danger' role='alert'>
                        {t('approvals.reasonRequired')}
                      </p>
                    )}
                  </div>
                )}

                <button className={`${primaryButtonClassName} w-full`} type='submit'>
                  <CheckCircle2 aria-hidden='true' className='size-3.5' />
                  {t('approvals.renewal.submit')}
                </button>
                <p className='flex items-start gap-1.5 text-[0.7rem] text-muted-foreground'>
                  <Info aria-hidden='true' className='mt-px size-3.5 shrink-0' />
                  {t('approvals.renewal.handoffNote')}
                </p>
              </form>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
