import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SubscriptionRenewalProposeBodyDtoNextPeriodBillingCycle as BillingCycle } from '~/shared/api/generated/model/subscription-renewals/subscriptionRenewalProposeBodyDtoNextPeriodBillingCycle'
import { ItField, itInputClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
export function RenewalPeriodFields({
  quantity,
  renewalOn,
  annual
}: {
  quantity: number
  renewalOn: string
  annual: boolean
}) {
  const { t: translate } = useTranslation('itRenewals')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(annual ? BillingCycle.ANNUAL : BillingCycle.MONTHLY)
  return (
    <>
      <input type='hidden' name='billingCycle' value={billingCycle} />{' '}
      <fieldset className='grid gap-4 sm:grid-cols-2 [&>.it-form-field]:row-span-3 [&>.it-form-field]:grid-rows-subgrid'>
        <legend className='mb-3 font-semibold'>{translate('nextPeriod')}</legend>
        <ItField label={translate('purchasedQuantity')} hint={translate('fieldHints.purchasedQuantity')}>
          <input
            name='purchasedQuantity'
            type='number'
            required
            min={0}
            max={1000000000}
            step={1}
            defaultValue={quantity}
            placeholder={translate('quantityPlaceholder')}
            className={itInputClass}
          />
        </ItField>
        <ItChoiceSelect
          label={translate('billingCycle')}
          required
          value={billingCycle}
          options={Object.values(BillingCycle).map((value) => ({ value, label: translate(`values.${value}`) }))}
          onChange={(value) => {
            const next = Object.values(BillingCycle).find((item) => item === value)
            if (next) setBillingCycle(next)
          }}
        />
        <ItField label={translate('amount')} hint={translate('fieldHints.amount')}>
          <input
            name='amount'
            required
            inputMode='numeric'
            pattern='[0-9]{1,16}'
            placeholder={translate('amountPlaceholder')}
            className={itInputClass}
          />
        </ItField>
        <ItField label={translate('currency')} hint={translate('fieldHints.currency')}>
          <input
            name='currency'
            required
            minLength={3}
            maxLength={3}
            pattern='VND'
            value='VND'
            readOnly
            placeholder={translate('currencyPlaceholder')}
            className={itInputClass}
          />
        </ItField>
        {(['startDate', 'endDate', 'renewalDate', 'noticeDeadline'] as const).map((key) => (
          <ItField key={key} label={translate(key)} hint={translate(`fieldHints.${key}`)}>
            <input
              name={key}
              type='date'
              required={key === 'startDate'}
              defaultValue={key === 'startDate' ? renewalOn : undefined}
              className={itInputClass}
            />
          </ItField>
        ))}
        <ItField label={translate('noticePeriodDays')} hint={translate('fieldHints.noticePeriodDays')}>
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
        <div className='row-span-3 grid content-center gap-2'>
          {(['autoRenew', 'allowsMidTermReduction'] as const).map((key) => (
            <label key={key} className='flex min-h-11 items-center gap-2 text-sm'>
              <input type='checkbox' name={key} />
              {translate(key)}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
