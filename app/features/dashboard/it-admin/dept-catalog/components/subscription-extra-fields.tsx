import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { MoneyInput } from '~/shared/ui/money-input'
import { itMoneyPattern } from '../../shared/components/it-money-pattern'
import { itAdminList, getItAdminListQueryKey } from '~/shared/api/generated/operations/it-admins/it-admin-list'
import type { SubscriptionResponseDtoData } from '~/shared/api/generated/model/subscriptions'
import { ItField, itInputClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItQueryState } from '../../shared/components/it-query-state'

export function SubscriptionExtraFields({
  subscription,
  allowPrimary,
  minimal = false,
  onDirty
}: {
  subscription?: NonNullable<SubscriptionResponseDtoData>
  allowPrimary: boolean
  minimal?: boolean
  onDirty: () => void
}) {
  const { t, i18n } = useTranslation('itCatalog')
  const [responsible, setResponsible] = useState(subscription?.responsibleItAdminEmployeeId ?? '')
  const [originalAmount, setOriginalAmount] = useState(subscription?.originalPrice?.amount ?? '')
  const pricePattern = itMoneyPattern(i18n.resolvedLanguage)
  const admins = useQuery({
    queryKey: [...getItAdminListQueryKey(), 'subscription-editor'],
    queryFn: async ({ signal }) => {
      const items = []
      let page = 1
      let pages = 1
      while (page <= pages) {
        const response = await itAdminList({ page, pageSize: 100 }, undefined, signal)
        if (!response.data) throw new Error('Missing IT administrators')
        items.push(...response.data.items)
        pages = response.data.pagination.totalPages
        page += 1
      }
      return items
    }
  })
  const options = (admins.data ?? []).map((item) => ({
    value: item.employeeId,
    label: `${item.fullName} · ${item.employeeCode}`
  }))
  if (
    subscription?.responsibleItAdmin &&
    !options.some((item) => item.value === subscription.responsibleItAdminEmployeeId)
  ) {
    options.unshift({
      value: subscription.responsibleItAdmin.employeeId,
      label: `${subscription.responsibleItAdmin.fullName} · ${subscription.responsibleItAdmin.employeeCode}`
    })
  }
  return (
    <fieldset className='grid gap-4 sm:grid-cols-2' onChange={onDirty}>
      {!minimal && <legend className='mb-3 font-semibold'>{t('subscriptionExtra.title')}</legend>}
      {!minimal && (
        <>
          <input type='hidden' name='originalAmount' value={originalAmount} />
          <ItField
            label={t('subscriptionExtra.originalAmount')}
            hint={t(subscription ? 'subscriptionExtra.originalHint' : 'subscriptionCreate.originalHint')}
          >
            <MoneyInput
              pattern={pricePattern}
              maxLength={40}
              value={originalAmount}
              onValueChange={setOriginalAmount}
              className={itInputClass}
            />
          </ItField>
          <ItField label={t('subscriptionExtra.originalCurrency')}>
            <input
              name='originalCurrency'
              required={!!originalAmount}
              defaultValue={subscription?.originalPrice?.currency ?? ''}
              pattern='[A-Za-z]{3}'
              maxLength={3}
              className={itInputClass}
            />
          </ItField>
          <ItField label={t('subscriptionExtra.minimum')} hint={t('subscriptionExtra.minimumHint')}>
            <input
              name='vendorMinimumSeats'
              type='number'
              min={1}
              max={1000000000}
              step={1}
              defaultValue={subscription?.vendorMinimumSeats ?? ''}
              className={itInputClass}
            />
          </ItField>
        </>
      )}
      <ItQueryState query={admins}>
        <ItChoiceSelect
          label={t('responsibleItAdmin')}
          value={responsible}
          options={options}
          clearable={!subscription}
          onChange={(value) => {
            setResponsible(value)
            onDirty()
          }}
        />
      </ItQueryState>
      <input type='hidden' name='responsibleItAdminEmployeeId' value={responsible} />
      {allowPrimary && (
        <>
          <input type='hidden' name='isPrimaryForPlanPresent' value='1' />
          <label className='flex min-h-11 items-center gap-2 text-sm sm:col-span-2'>
            <input type='checkbox' name='isPrimaryForPlan' defaultChecked={subscription?.isPrimaryForPlan} />
            {t('subscriptionExtra.primary')}
          </label>
        </>
      )}
    </fieldset>
  )
}
