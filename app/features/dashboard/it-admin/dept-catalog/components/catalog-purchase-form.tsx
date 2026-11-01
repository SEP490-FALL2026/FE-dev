import { CatalogProvisioningType } from '../enums/provisioning-type'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeclarePlanBodyDtoPricingModel } from '~/shared/api/generated/model/plans/declarePlanBodyDtoPricingModel'
import { DeclarePlanBodyDtoControlLevel } from '~/shared/api/generated/model/plans/declarePlanBodyDtoControlLevel'
import { DeclareSubscriptionBodyDtoKind } from '~/shared/api/generated/model/subscriptions/declareSubscriptionBodyDtoKind'
import { usePlanCreate } from '~/shared/api/generated/operations/plans/plan-create'
import { getPlanListQueryKey } from '~/shared/api/generated/operations/plans/plan-list'
import { useSubscriptionCreate } from '~/shared/api/generated/operations/subscriptions/subscription-create'
import { getSubscriptionListQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { uuidPattern } from './catalog-application-form'
export function CatalogPurchaseForm({
  mode,
  applicationId,
  applicationKind,
  planId,
  onClose
}: {
  mode: 'plan' | 'subscription'
  applicationId: string
  applicationKind: string
  planId?: string
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [selectedType, setSelectedType] = useState('')
  const feedback = useItMutationFeedback([getPlanListQueryKey(), getSubscriptionListQueryKey()], onClose)
  const plan = usePlanCreate({ mutation: feedback })
  const subscription = useSubscriptionCreate({ mutation: feedback })
  return (
    <ItFormDialog
      wide
      title={translate(mode === 'plan' ? 'addPlan' : 'addSubscription')}
      pending={plan.isPending || subscription.isPending}
      submitLabel={translate('save')}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        const values = new FormData(event.currentTarget)
        if (mode === 'plan') {
          const provisioningType = Object.values(CatalogProvisioningType).find(
            (value) => value === values.get('provisioning')
          )
          const name = String(values.get('name') ?? '').trim()
          const pricingModel = Object.values(DeclarePlanBodyDtoPricingModel).find(
            (value) => value === values.get('pricingModel')
          )
          const controlLevel = Object.values(DeclarePlanBodyDtoControlLevel).find(
            (value) => value === values.get('controlLevel')
          )
          if (provisioningType && name)
            plan.mutate({
              data: {
                applicationId,
                name,
                provisioningType,
                ...(provisioningType !== 'K5' ? { pricingModel, controlLevel } : {})
              }
            })
        } else if (planId) {
          const kind = Object.values(DeclareSubscriptionBodyDtoKind).find((value) => value === values.get('kind'))
          const quantity = String(values.get('quantity') ?? '')
          if (kind)
            subscription.mutate({
              data: {
                planId,
                ownerDepartmentId: String(values.get('department')).trim(),
                kind,
                ...(quantity ? { purchasedQuantity: Number(quantity) } : {})
              }
            })
        }
      }}
    >
      {mode === 'plan' ? (
        <>
          <ItField label={translate('planName')}>
            <input name='name' required maxLength={1000} className={itInputClass} />
          </ItField>
          <fieldset>
            <legend>{translate('provisioning')}</legend>
            {Object.values(CatalogProvisioningType)
              .filter(
                (value) =>
                  value !== 'K3' &&
                  (applicationKind === 'INTERNAL'
                    ? value === 'K5'
                    : applicationKind === 'LICENSED'
                      ? value === 'K4'
                      : value === 'K1' || value === 'K2')
              )
              .map((value) => (
                <label key={value} className='flex min-h-11 items-center gap-2'>
                  <input
                    type='radio'
                    required
                    name='provisioning'
                    value={value}
                    onChange={() => setSelectedType(value)}
                  />
                  {translate(`enums.${value}`)}
                </label>
              ))}
          </fieldset>
          {selectedType && selectedType !== 'K5' && (
            <>
              {(
                [
                  ['pricingModel', DeclarePlanBodyDtoPricingModel],
                  ['controlLevel', DeclarePlanBodyDtoControlLevel]
                ] as const
              ).map(([key, options]) => (
                <fieldset key={key}>
                  <legend>{translate(key)}</legend>
                  {Object.values(options).map((value) => (
                    <label key={value} className='flex min-h-11 items-center gap-2'>
                      <input type='radio' required name={key} value={value} />
                      {translate(`enums.${value}`, { defaultValue: translate('unknown') })}
                    </label>
                  ))}
                </fieldset>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          <ItField label={translate('department')}>
            <input name='department' required pattern={uuidPattern} className={itInputClass} />
          </ItField>
          <fieldset>
            <legend>{translate('subscriptionKind')}</legend>
            {Object.values(DeclareSubscriptionBodyDtoKind).map((value) => (
              <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                <input type='radio' required name='kind' value={value} />
                {translate(`enums.${value}`)}
              </label>
            ))}
          </fieldset>
          <ItField label={translate('quantity')}>
            <input name='quantity' type='number' min={0} max={1000000000} step={1} className={itInputClass} />
          </ItField>
        </>
      )}
    </ItFormDialog>
  )
}
