import { useTranslation } from 'react-i18next'
import type { SubscriptionResponseDtoData } from '~/shared/api/generated/model/subscriptions'
import { UpdateSubscriptionBodyDtoBillingCycle } from '~/shared/api/generated/model/subscriptions/updateSubscriptionBodyDtoBillingCycle'

export function SubscriptionBillingFields({
  subscription,
  planType,
  onDirty
}: {
  subscription: NonNullable<SubscriptionResponseDtoData>
  planType?: string
  onDirty: () => void
}) {
  const { t } = useTranslation('itCatalog')
  return (
    <>
      {subscription.kind === 'TERM' && (
        <fieldset onChange={onDirty}>
          <legend>{t('billingCycle')}</legend>
          <p className='text-xs font-normal text-muted-foreground'>{t('help.billingCycle')}</p>
          {Object.values(UpdateSubscriptionBodyDtoBillingCycle)
            .filter(
              (value) =>
                (planType !== 'K1' || value === 'MONTHLY') &&
                (value === 'MONTHLY' || value === 'ANNUAL' || value === subscription.billingCycle)
            )
            .map((value) => (
              <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                <input
                  type='radio'
                  name='billingCycle'
                  value={value}
                  defaultChecked={value === subscription.billingCycle}
                />
                {t(`enums.${value}`, { defaultValue: t('unknown') })}
              </label>
            ))}
        </fieldset>
      )}
      {subscription.kind === 'TERM' && (planType === 'K1' || planType === 'K2') && (
        <fieldset onChange={onDirty}>
          <legend>{t('setup.commitment')}</legend>
          {([1, 12] as const)
            .filter((months) => planType !== 'K1' || months === 1)
            .map((months) => (
              <label key={months} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                <input
                  type='radio'
                  name='commitmentTermMonths'
                  value={months}
                  defaultChecked={subscription.commitmentTermMonths === months}
                />
                {t('setup.monthCount', { count: months })}
              </label>
            ))}
        </fieldset>
      )}
    </>
  )
}
