import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { toast } from 'sonner'
import { useSubscriptionRenewalPropose } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-propose'
import {
  getSubscriptionRenewalAdjustmentGetQueryKey,
  useSubscriptionRenewalAdjustmentGet
} from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-adjustment-get'
import { getSubscriptionRenewalListQueryKey } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import type { SubscriptionRenewalProposeBodyDto } from '~/shared/api/generated/model/subscription-renewals'
import { useWorkspaceFormat } from '~/shared/hooks/use-workspace-format'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { RenewalChoice } from '../enums/renewal-choice'
import { AdjustmentOutcome as RenewalOutcome } from '../enums/renewal-outcome'
import { RenewalPeriodFields } from './renewal-period-fields'

export function RenewalProposalDialog({
  subscription,
  onClose,
  onOpenCase
}: {
  subscription: { id: string; applicationName: string; planName: string }
  onClose: () => void
  onOpenCase: (id: string) => void
}) {
  const { t: translate } = useTranslation('itRenewals')
  const { formatNumber, formatDate } = useWorkspaceFormat()
  const query = useSubscriptionRenewalAdjustmentGet({ subscriptionId: subscription.id }, { query: { staleTime: 0 } })
  const adjustment = query.data?.data?.adjustment
  const errorRenewalId = axios.isAxiosError<{ error?: { details?: { renewalId?: string } } }>(query.error)
    ? query.error.response?.data?.error?.details?.renewalId
    : undefined
  const existingId = adjustment?.recordedRenewalId ?? errorRenewalId
  const [selectedChoice, setChoice] = useState<RenewalChoice>()
  const suggestedChoice =
    adjustment?.suggestedChoice === RenewalChoice.CANCEL && !adjustment.canCancel
      ? undefined
      : adjustment?.suggestedChoice
  const choice = selectedChoice ?? suggestedChoice ?? undefined
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())
  const beforeAdjustment = !!adjustment && today < adjustment.adjustmentPointOn
  const [outcome, setOutcome] = useState<RenewalOutcome>(RenewalOutcome.AS_DECIDED)
  const [checking, setChecking] = useState(false)
  const submitting = useRef(false)
  const [note, setNote] = useState('')
  const [outcomeNote, setOutcomeNote] = useState('')
  const [exported, setExported] = useState(false)
  const [transferred, setTransferred] = useState(false)
  const feedback = useItMutationFeedback(
    [
      getSubscriptionRenewalListQueryKey(),
      getSubscriptionRenewalAdjustmentGetQueryKey({ subscriptionId: subscription.id })
    ],
    onClose
  )
  const mutation = useSubscriptionRenewalPropose({ mutation: feedback })
  const cancel = choice === RenewalChoice.CANCEL && outcome === RenewalOutcome.AS_DECIDED
  const needsPeriod =
    !!choice &&
    !cancel &&
    !(
      choice !== RenewalChoice.CANCEL &&
      outcome === RenewalOutcome.VENDOR_REFUSED &&
      adjustment?.commitment === 'MONTHLY'
    )
  const invalid =
    !adjustment ||
    beforeAdjustment ||
    !choice ||
    !!adjustment.recordedRenewalId ||
    (choice === RenewalChoice.CANCEL && !adjustment.canCancel) ||
    (adjustment.target > adjustment.seatsNeeded.total && !note.trim()) ||
    (outcome !== RenewalOutcome.AS_DECIDED && !outcomeNote.trim()) ||
    (cancel && (!exported || !transferred))
  return (
    <ItFormDialog
      page
      title={translate('recordOutcome')}
      pending={checking || mutation.isPending}
      submitLabel={translate('recordOutcome')}
      onClose={onClose}
      submitDisabled={invalid || query.isFetching || query.isError}
      onSubmit={async (event) => {
        event.preventDefault()
        if (invalid || submitting.current || !adjustment || !choice) return
        const form = new FormData(event.currentTarget)
        const text = (key: string) => String(form.get(key) ?? '').trim()
        submitting.current = true
        setChecking(true)
        try {
          const refreshed = await query.refetch()
          const fresh = refreshed.data?.data?.adjustment
          if (refreshed.isError || !fresh) return
          if (JSON.stringify(fresh) !== JSON.stringify(adjustment)) {
            toast.info(translate('adjustmentChanged'))
            return
          }
          const data: SubscriptionRenewalProposeBodyDto = {
            subscriptionId: subscription.id,
            choice,
            outcome,
            ...(choice !== RenewalChoice.CANCEL ? { proposedQuantity: fresh.target } : {}),
            ...(note.trim() ? { note: note.trim() } : {}),
            ...(outcomeNote.trim() ? { outcomeNote: outcomeNote.trim() } : {}),
            ...(cancel ? { closure: { dataExported: true, adminsTransferred: true } } : {}),
            ...(needsPeriod
              ? {
                  nextPeriod: {
                    purchasedQuantity: Number(text('purchasedQuantity')),
                    unitPrice: { amount: text('amount'), currency: 'VND' },
                    billingCycle: text('billingCycle') as NonNullable<
                      SubscriptionRenewalProposeBodyDto['nextPeriod']
                    >['billingCycle'],
                    startDate: text('startDate'),
                    ...(text('endDate') ? { endDate: text('endDate') } : {}),
                    ...(text('renewalDate') ? { renewalDate: text('renewalDate') } : {}),
                    ...(text('noticeDeadline') ? { noticeDeadline: text('noticeDeadline') } : {}),
                    ...(text('noticePeriodDays') ? { noticePeriodDays: Number(text('noticePeriodDays')) } : {}),
                    autoRenew: form.has('autoRenew'),
                    allowsMidTermReduction: form.has('allowsMidTermReduction')
                  }
                }
              : {})
          }
          await mutation.mutateAsync({ data }).catch(() => undefined)
        } finally {
          submitting.current = false
          setChecking(false)
        }
      }}
    >
      <p className='font-medium'>
        {subscription.applicationName} <span aria-hidden>·</span> {subscription.planName}
      </p>
      {existingId && (
        <button
          type='button'
          className='min-h-11 text-left text-primary-ink hover:underline'
          onClick={() => onOpenCase(existingId)}
        >
          {translate('details')}
        </button>
      )}
      <ItQueryState query={query}>
        {adjustment && (
          <>
            <p className='text-sm text-muted-foreground'>{translate('proposalHint')}</p>
            {beforeAdjustment && (
              <p
                role='status'
                className='rounded-md border border-border bg-surface-subtle p-3 text-sm text-muted-foreground'
              >
                {translate('opensOn', { date: formatDate(adjustment.adjustmentPointOn) })}
              </p>
            )}
            {!adjustment.callerIsResponsible && (
              <p role='status' className='text-sm text-warning'>
                {translate('recordingForResponsible')}
              </p>
            )}
            <dl className='grid gap-4 rounded-lg border border-border bg-surface-subtle p-4 sm:grid-cols-3'>
              {Object.entries({
                target: adjustment.target,
                heldPastRenewal: adjustment.seatsNeeded.heldPastRenewal,
                pendingContinuations: adjustment.seatsNeeded.pendingContinuations,
                approvedAwaitingGrant: adjustment.seatsNeeded.approvedAwaitingGrant,
                activeSeatsToday: adjustment.activeSeatsToday,
                openRequests: adjustment.openRequests
              }).map(([key, value]) => (
                <div key={key}>
                  <dt className='text-xs text-muted-foreground'>{translate(key as 'target')}</dt>
                  <dd className='mt-1 font-mono tabular-nums'>{formatNumber(value)}</dd>
                </div>
              ))}
              {(['adjustmentPointOn', 'renewalOn'] as const).map((key) => (
                <div key={key}>
                  <dt className='text-xs text-muted-foreground'>{translate(key)}</dt>
                  <dd className='mt-1 font-mono text-sm tabular-nums'>{formatDate(adjustment[key])}</dd>
                </div>
              ))}
            </dl>
            {adjustment.recordedRenewalId && <p role='status'>{translate('alreadyRecorded')}</p>}
            <fieldset className='grid gap-2 sm:grid-cols-2'>
              <legend className='mb-2 text-sm font-medium'>{translate('choice')}</legend>
              {Object.values(RenewalChoice).map((value) => (
                <label
                  key={value}
                  className='flex min-h-11 items-center gap-2 rounded-md border border-border p-3 text-sm'
                >
                  <input
                    type='radio'
                    name='choice'
                    checked={choice === value}
                    disabled={value === RenewalChoice.CANCEL && !adjustment.canCancel}
                    onChange={() => setChoice(value)}
                  />
                  {translate(`values.${value}`)}
                </label>
              ))}
            </fieldset>
            {!adjustment.canCancel && (
              <p className='text-sm text-muted-foreground'>{translate('cancellationRequirements')}</p>
            )}
            <ItField label={translate('note')}>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                required={adjustment.target > adjustment.seatsNeeded.total}
                maxLength={2000}
                className={itInputClass}
              />
            </ItField>
            <ItChoiceSelect
              label={translate('outcome')}
              value={outcome}
              options={Object.values(RenewalOutcome).map((value) => ({ value, label: translate(`values.${value}`) }))}
              onChange={(value) => {
                const next = Object.values(RenewalOutcome).find((item) => item === value)
                if (next) setOutcome(next)
              }}
            />
            <ItField label={translate('outcomeNote')}>
              <textarea
                value={outcomeNote}
                onChange={(event) => setOutcomeNote(event.target.value)}
                required={outcome !== RenewalOutcome.AS_DECIDED}
                maxLength={2000}
                className={itInputClass}
              />
            </ItField>
            {cancel && (
              <fieldset className='space-y-2'>
                <label className='flex min-h-11 items-center gap-2 text-sm'>
                  <input type='checkbox' checked={exported} onChange={(event) => setExported(event.target.checked)} />
                  {translate('dataExported')}
                </label>
                <label className='flex min-h-11 items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={transferred}
                    onChange={(event) => setTransferred(event.target.checked)}
                  />
                  {translate('adminsTransferred')}
                </label>
              </fieldset>
            )}
            {needsPeriod && (
              <RenewalPeriodFields
                key={adjustment.renewalOn}
                quantity={adjustment.target}
                renewalOn={adjustment.renewalOn}
                annual={adjustment.commitment === 'ANNUAL'}
              />
            )}
          </>
        )}
      </ItQueryState>
    </ItFormDialog>
  )
}
