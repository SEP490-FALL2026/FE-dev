import { CatalogProvisioningType } from '../enums/provisioning-type'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeclareSubscriptionBodyDtoBillingCycle } from '~/shared/api/generated/model/subscriptions/declareSubscriptionBodyDtoBillingCycle'
import { DeclareSubscriptionBodyDtoKind } from '~/shared/api/generated/model/subscriptions/declareSubscriptionBodyDtoKind'
import { usePlanCreate } from '~/shared/api/generated/operations/plans/plan-create'
import { getPlanListQueryKey } from '~/shared/api/generated/operations/plans/plan-list'
import { useSubscriptionCreate } from '~/shared/api/generated/operations/subscriptions/subscription-create'
import { getSubscriptionListQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { uuidPattern } from './catalog-application-form'
import { ItDirectoryLookup } from '../../shared/components/it-directory-lookup'
import { usePlanGet } from '~/shared/api/generated/operations/plans/plan-get'
import { CatalogPlanRules, readPlanRules } from './catalog-plan-rules'
import type { PlanResponseDtoData } from '~/shared/api/generated/model/plans'
export function CatalogPurchaseForm({
  mode,
  applicationId,
  applicationKind,
  planId,
  onClose,
  onPlanCreated,
  onSubscriptionCreated
}: {
  mode: 'plan' | 'subscription'
  applicationId: string
  applicationKind: string
  planId?: string
  onClose: () => void
  onPlanCreated?: (plan: NonNullable<PlanResponseDtoData>) => void
  onSubscriptionCreated?: (id: string) => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [selectedType, setSelectedType] = useState('')
  const [selectedSubscriptionKind, setSelectedSubscriptionKind] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const selectedPlan = usePlanGet(planId ?? '', { query: { enabled: mode === 'subscription' && !!planId } })
  const sharedPool =
    selectedPlan.data?.data?.provisioningType === 'K2' || selectedPlan.data?.data?.provisioningType === 'K4'
  const perpetualOnly = selectedPlan.data?.data?.provisioningType === 'K4'
  const isPerpetual = perpetualOnly || selectedSubscriptionKind === 'PERPETUAL'
  const feedback = useItMutationFeedback([getPlanListQueryKey(), getSubscriptionListQueryKey()])
  const plan = usePlanCreate({
    mutation: {
      ...feedback,
      onSuccess: async (response) => {
        await feedback.onSuccess()
        if (response.data && onPlanCreated) onPlanCreated(response.data)
        else onClose()
      }
    }
  })
  const subscription = useSubscriptionCreate({
    mutation: {
      ...feedback,
      onSuccess: async (response) => {
        await feedback.onSuccess()
        if (response.data?.id && onSubscriptionCreated) onSubscriptionCreated(response.data.id)
        else onClose()
      }
    }
  })
  return (
    <ItFormDialog
      wide
      title={translate(mode === 'plan' ? 'addPlan' : 'addSubscription')}
      pending={plan.isPending || subscription.isPending}
      submitDisabled={
        mode === 'subscription' &&
        (selectedPlan.isFetching || selectedPlan.isError || !selectedPlan.data?.data || !sharedPool)
      }
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
          const rules = provisioningType ? readPlanRules(values, provisioningType) : null
          if (provisioningType && provisioningType !== 'K3' && name && rules)
            plan.mutate({
              data: {
                applicationId,
                name,
                provisioningType,
                ...rules
              }
            })
        } else if (planId) {
          const kind = Object.values(DeclareSubscriptionBodyDtoKind).find((value) => value === values.get('kind'))
          const quantity = String(values.get('quantity') ?? '')
          const amount = String(values.get('amount') ?? '').trim()
          const billingCycle = Object.values(DeclareSubscriptionBodyDtoBillingCycle).find(
            (value) => value === values.get('billingCycle')
          )
          const startDate = String(values.get('startDate') ?? '')
          const endDate = String(values.get('endDate') ?? '')
          const commitmentTerm = values.get('commitmentTermMonths')
          const commitmentTermMonths = commitmentTerm === '1' ? 1 : commitmentTerm === '12' ? 12 : undefined
          if (kind)
            subscription.mutate({
              data: {
                planId,
                ...(!sharedPool && departmentId ? { ownerDepartmentId: departmentId } : {}),
                kind,
                ...(quantity ? { purchasedQuantity: Number(quantity) } : {}),
                ...(amount ? { unitPrice: { amount, currency: 'VND' } } : {}),
                ...(billingCycle ? { billingCycle } : {}),
                ...(commitmentTermMonths ? { commitmentTermMonths } : {}),
                ...(startDate ? { startDate } : {}),
                ...(endDate ? { endDate } : {})
              }
            })
        }
      }}
    >
      {mode === 'plan' ? (
        <>
          <ItField label={translate('planName')} hint={translate('help.planName')}>
            <input
              placeholder={translate('placeholders.plan')}
              name='name'
              required
              maxLength={1000}
              className={itInputClass}
            />
          </ItField>
          <fieldset>
            <legend>
              {translate('provisioning')}{' '}
              <span aria-hidden='true' className='text-danger'>
                *
              </span>
            </legend>
            <p className='text-xs font-normal text-muted-foreground'>{translate('help.provisioning')}</p>
            {Object.values(CatalogProvisioningType)
              .filter(
                (value) =>
                  value !== 'K3' &&
                  (applicationKind === 'INTERNAL' ? value === 'K5' : value === 'K1' || value === 'K2' || value === 'K4')
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
          {selectedType && <CatalogPlanRules key={selectedType} provisioningType={selectedType} />}
        </>
      ) : (
        <>
          {!sharedPool && (
            <ItField label={translate('department')} hint={translate('help.department')}>
              <input
                placeholder={translate('placeholders.departmentId')}
                name='department'
                pattern={uuidPattern}
                value={departmentId}
                onChange={(event) => setDepartmentId(event.target.value)}
                className={itInputClass}
              />
            </ItField>
          )}
          {!sharedPool && <ItDirectoryLookup mode='department' onSelect={setDepartmentId} />}
          <fieldset>
            <legend>
              {translate('subscriptionKind')}{' '}
              <span aria-hidden='true' className='text-danger'>
                *
              </span>
            </legend>
            <p className='text-xs font-normal text-muted-foreground'>{translate('help.subscriptionKind')}</p>
            {Object.values(DeclareSubscriptionBodyDtoKind)
              .filter((value) => !perpetualOnly || value === 'PERPETUAL')
              .map((value) => (
                <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                  <input
                    type='radio'
                    required
                    name='kind'
                    value={value}
                    onChange={() => setSelectedSubscriptionKind(value)}
                  />
                  {translate(`enums.${value}`)}
                </label>
              ))}
          </fieldset>
          <ItField label={translate('quantity')} hint={translate('help.quantity')}>
            <input
              placeholder={translate('placeholders.quantity')}
              name='quantity'
              type='number'
              min={0}
              max={1000000000}
              step={1}
              className={itInputClass}
            />
          </ItField>
          <div className='grid gap-4 sm:grid-cols-2 [&>.it-form-field]:row-span-3 [&>.it-form-field]:grid-rows-subgrid'>
            <ItField label={translate('unitAmount')} hint={translate('help.unitAmount')}>
              <input name='amount' inputMode='numeric' pattern='[0-9]{1,16}' maxLength={16} className={itInputClass} />
            </ItField>
            <ItField label={translate('startDate')}>
              <input name='startDate' type='date' className={itInputClass} />
            </ItField>
            {!isPerpetual && (
              <ItField label={translate('endDate')}>
                <input name='endDate' type='date' className={itInputClass} />
              </ItField>
            )}
          </div>
          {!isPerpetual && (
            <fieldset>
              <legend>{translate('billingCycle')}</legend>
              {Object.values(DeclareSubscriptionBodyDtoBillingCycle).map((value) => (
                <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                  <input type='radio' name='billingCycle' value={value} />
                  {translate(`enums.${value}`)}
                </label>
              ))}
            </fieldset>
          )}
          {!isPerpetual && (
            <fieldset>
              <legend>{translate('setup.commitment')}</legend>
              {([1, 12] as const).map((months) => (
                <label key={months} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                  <input type='radio' name='commitmentTermMonths' value={months} />
                  {translate('setup.monthCount', { count: months })}
                </label>
              ))}
            </fieldset>
          )}
        </>
      )}
    </ItFormDialog>
  )
}
