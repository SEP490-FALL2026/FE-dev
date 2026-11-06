import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionRenewalRecordOutcome } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-record-outcome'
import { getSubscriptionRenewalListQueryKey } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-list'
import { getSubscriptionRenewalGetQueryKey } from '~/shared/api/generated/operations/subscription-renewals/subscription-renewal-get'
import { getSubscriptionListQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { SubscriptionRenewalOutcomeBodyDtoNextPeriodBillingCycle as BillingCycle } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalOutcomeBodyDtoNextPeriodBillingCycle'
import type {
  SubscriptionRenewalResponseDtoDataRenewal,
  SubscriptionRenewalOutcomeBodyDto
} from '~/shared/api/generated/model/subscription-renewals'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { RenewalOutcome } from '../enums/renewal-outcome'

export function RenewalOutcomeDialog({
  renewal,
  onClose
}: {
  renewal: SubscriptionRenewalResponseDtoDataRenewal
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itRenewals')
  const [outcome, setOutcome] = useState<RenewalOutcome>(RenewalOutcome.AS_DECIDED)
  const [confirmedPeriod, setConfirmedPeriod] = useState(false)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY)
  const [note, setNote] = useState('')
  const needsNote = outcome === RenewalOutcome.VENDOR_REFUSED || outcome === RenewalOutcome.DIFFERENT
  const needsPeriod = outcome === RenewalOutcome.AS_DECIDED && renewal.decidedChoice !== 'CANCEL'
  const showPeriod = needsPeriod || (outcome === RenewalOutcome.DIFFERENT && confirmedPeriod)
  const feedback = useItMutationFeedback(
    [
      getSubscriptionRenewalListQueryKey(),
      getSubscriptionRenewalGetQueryKey(renewal.id),
      getSubscriptionListQueryKey()
    ],
    onClose
  )
  const mutation = useSubscriptionRenewalRecordOutcome({ mutation: feedback })
  const cancellationBlocked =
    outcome === RenewalOutcome.AS_DECIDED && renewal.decidedChoice === 'CANCEL' && renewal.period.seatsInUse > 0
  return (
    <ItFormDialog
      page={showPeriod}
      title={translate('recordOutcome')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translate('recordOutcome')}
      submitDisabled={renewal.state !== 'DECIDED' || cancellationBlocked || (needsNote && !note.trim())}
      onSubmit={(event) => {
        event.preventDefault()
        if (mutation.isPending || renewal.state !== 'DECIDED' || cancellationBlocked || (needsNote && !note.trim()))
          return
        const form = new FormData(event.currentTarget)
        const text = (key: string) => String(form.get(key) ?? '').trim()
        const nextPeriod: SubscriptionRenewalOutcomeBodyDto['nextPeriod'] = showPeriod
          ? {
              purchasedQuantity: Number(text('purchasedQuantity')),
              unitPrice: { amount: text('amount'), currency: text('currency').toUpperCase() },
              billingCycle,
              startDate: text('startDate'),
              ...(text('endDate') ? { endDate: text('endDate') } : {}),
              ...(text('renewalDate') ? { renewalDate: text('renewalDate') } : {}),
              ...(text('noticeDeadline') ? { noticeDeadline: text('noticeDeadline') } : {}),
              ...(text('noticePeriodDays') ? { noticePeriodDays: Number(text('noticePeriodDays')) } : {}),
              autoRenew: form.has('autoRenew'),
              allowsMidTermReduction: form.has('allowsMidTermReduction')
            }
          : undefined
        mutation.mutate({
          id: renewal.id,
          data: { outcome, ...(note.trim() ? { note: note.trim() } : {}), ...(nextPeriod ? { nextPeriod } : {}) }
        })
      }}
    >
      <p className='text-sm text-muted-foreground'>{translate('outcomeHint')}</p>
      <ItChoiceSelect
        label={translate('outcome')}
        value={outcome}
        options={Object.values(RenewalOutcome).map((value) => ({ value, label: translate(`values.${value}`) }))}
        onChange={(value) => {
          const next = Object.values(RenewalOutcome).find((item) => item === value)
          if (next) setOutcome(next)
        }}
      />
      {cancellationBlocked && (
        <p role='status' className='text-sm text-danger'>
          {translate('cancelBlocked', { count: renewal.period.seatsInUse })}
        </p>
      )}
      <ItField label={translate('outcomeNote')}>
        <textarea
          name='note'
          required={needsNote}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={2000}
          placeholder={translate('outcomeNotePlaceholder')}
          className={itInputClass}
        />
      </ItField>
      {outcome === RenewalOutcome.DIFFERENT && (
        <label className='flex min-h-11 items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={confirmedPeriod}
            onChange={(event) => setConfirmedPeriod(event.target.checked)}
          />
          {translate('confirmedPeriod')}
        </label>
      )}
      {showPeriod && (
        <fieldset className='grid gap-4 sm:grid-cols-2'>
          <legend className='mb-3 font-semibold'>{translate('nextPeriod')}</legend>
          <ItField label={translate('purchasedQuantity')}>
            <input
              name='purchasedQuantity'
              type='number'
              required
              min={0}
              max={1000000000}
              step={1}
              defaultValue={renewal.decision?.quantity ?? undefined}
              placeholder={translate('quantityPlaceholder')}
              className={itInputClass}
            />
          </ItField>
          <ItChoiceSelect
            label={translate('billingCycle')}
            value={billingCycle}
            options={Object.values(BillingCycle).map((value) => ({ value, label: translate(`values.${value}`) }))}
            onChange={(value) => {
              const next = Object.values(BillingCycle).find((item) => item === value)
              if (next) setBillingCycle(next)
            }}
          />
          <ItField label={translate('amount')}>
            <input
              name='amount'
              required
              inputMode='decimal'
              pattern='[0-9]+([.][0-9]+)?'
              placeholder={translate('amountPlaceholder')}
              className={itInputClass}
            />
          </ItField>
          <ItField label={translate('currency')}>
            <input
              name='currency'
              required
              minLength={3}
              maxLength={3}
              pattern='[A-Za-z]{3}'
              placeholder={translate('currencyPlaceholder')}
              className={itInputClass}
            />
          </ItField>
          {(['startDate', 'endDate', 'renewalDate', 'noticeDeadline'] as const).map((key) => (
            <ItField key={key} label={translate(key)}>
              <input name={key} type='date' required={key === 'startDate'} className={itInputClass} />
            </ItField>
          ))}
          <ItField label={translate('noticePeriodDays')}>
            <input
              name='noticePeriodDays'
              type='number'
              min={0}
              max={3650}
              step={1}
              placeholder={translate('daysPlaceholder')}
              className={itInputClass}
            />
          </ItField>
          <div className='grid content-center gap-2'>
            {(['autoRenew', 'allowsMidTermReduction'] as const).map((key) => (
              <label key={key} className='flex min-h-11 items-center gap-2 text-sm'>
                <input type='checkbox' name={key} />
                {translate(key)}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </ItFormDialog>
  )
}
