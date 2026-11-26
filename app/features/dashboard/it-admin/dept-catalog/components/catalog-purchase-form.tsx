import { CatalogProvisioningType } from '../enums/provisioning-type'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MoneyInput } from '~/shared/ui/money-input'
import { itMoneyPattern } from '../../shared/components/it-money-pattern'
import { DeclareSubscriptionBodyDtoKind } from '~/shared/api/generated/model/subscriptions/declareSubscriptionBodyDtoKind'
import { usePlanCreate } from '~/shared/api/generated/operations/plans/plan-create'
import { getPlanListQueryKey } from '~/shared/api/generated/operations/plans/plan-list'
import { useSubscriptionCreate } from '~/shared/api/generated/operations/subscriptions/subscription-create'
import {
  getSubscriptionListQueryKey,
  useSubscriptionList
} from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { usePlanGet } from '~/shared/api/generated/operations/plans/plan-get'
import { CatalogPlanRules, readPlanRules } from './catalog-plan-rules'
import type { PlanResponseDtoData } from '~/shared/api/generated/model/plans'
import { buildSubscriptionCreate } from '../subscription-create'
import { SubscriptionExtraFields } from './subscription-extra-fields'
import { CatalogSubscriptionEditor } from './catalog-subscription-editor'
import { CatalogWorkspaceSetup } from './catalog-workspace-setup'
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
  const { t: translate, i18n } = useTranslation('itCatalog')
  const [unitAmount, setUnitAmount] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [kind, setKind] = useState('')
  const [invalidTerms, setInvalidTerms] = useState(false)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const selectedPlan = usePlanGet(planId ?? '', { query: { enabled: mode === 'subscription' && !!planId } })
  const existing = useSubscriptionList(
    { planId, page: 1, pageSize: 1 },
    { query: { enabled: mode === 'subscription' && !!planId, staleTime: 0 } }
  )
  const sharedPool = ['K1', 'K2', 'K4'].includes(selectedPlan.data?.data?.provisioningType ?? '')
  const planType = selectedPlan.data?.data?.provisioningType
  const workspaceRequired = planType === 'K2' || (planType === 'K4' && selectedPlan.data?.data?.hasAdminConsole)
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
  if (mode === 'subscription' && existing.data?.data?.items[0])
    return <CatalogSubscriptionEditor id={existing.data.data.items[0].id} onClose={onClose} />
  return (
    <>
      <ItFormDialog
        wide
        title={translate(mode === 'plan' ? 'addPlan' : 'addSubscription')}
        pending={plan.isPending || subscription.isPending}
        submitDisabled={
          mode === 'subscription' &&
          (existing.isFetching ||
            existing.isError ||
            !existing.data?.data ||
            selectedPlan.isFetching ||
            selectedPlan.isError ||
            !selectedPlan.data?.data ||
            !sharedPool)
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
            const data = buildSubscriptionCreate(values, planId)
            if (data?.billingCycle === 'ANNUAL' && data.commitmentTermMonths === 1) {
              setInvalidTerms(true)
              return
            }
            setInvalidTerms(false)
            if (data) subscription.mutate({ data })
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
                    (applicationKind === 'INTERNAL'
                      ? value === 'K5'
                      : value === 'K1' || value === 'K2' || value === 'K4')
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
            {workspaceRequired && selectedPlan.data?.data?.workspaceProfile === null && (
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>{translate('subscriptionCreate.workspaceHint')}</p>
                <button type='button' className='underline' onClick={() => setWorkspaceOpen(true)}>
                  {translate('setup.openWorkspace')}
                </button>
              </div>
            )}
            <fieldset>
              <legend>
                {translate('subscriptionKind')}{' '}
                <span aria-hidden='true' className='text-danger'>
                  *
                </span>
              </legend>
              <p className='text-xs font-normal text-muted-foreground'>{translate('help.subscriptionKind')}</p>
              {Object.values(DeclareSubscriptionBodyDtoKind)
                .filter((value) => value === (planType === 'K4' ? 'PERPETUAL' : 'TERM'))
                .map((value) => (
                  <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                    <input type='radio' required name='kind' value={value} onChange={() => setKind(value)} />
                    {translate(`enums.${value}`)}
                  </label>
                ))}
            </fieldset>
            <div className='grid gap-4 sm:grid-cols-2'>
              <ItField label={translate('quantity')} hint={translate('help.quantity')}>
                <input name='quantity' type='number' min={0} max={1000000000} step={1} className={itInputClass} />
              </ItField>
              <ItField label={translate('unitAmount')} hint={translate('help.unitAmount')}>
                <MoneyInput
                  inputMode='numeric'
                  pattern={itMoneyPattern(i18n.resolvedLanguage, false)}
                  maxLength={16}
                  value={unitAmount}
                  onValueChange={setUnitAmount}
                  className={itInputClass}
                />
              </ItField>
              <input type='hidden' name='amount' value={unitAmount} />
              <ItField label={translate('startDate')} hint={translate('help.startDate')}>
                <input name='startDate' type='date' className={itInputClass} />
              </ItField>
            </div>
            {kind === 'TERM' && (
              <>
                <fieldset>
                  <legend>{translate('billingCycle')}</legend>
                  {(['MONTHLY', 'ANNUAL'] as const)
                    .filter((value) => planType !== 'K1' || value === 'MONTHLY')
                    .map((value) => (
                      <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                        <input type='radio' name='billingCycle' value={value} />
                        {translate(`enums.${value}`)}
                      </label>
                    ))}
                </fieldset>
                <fieldset>
                  <legend>{translate('setup.commitment')}</legend>
                  {([1, 12] as const)
                    .filter((value) => planType !== 'K1' || value === 1)
                    .map((value) => (
                      <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
                        <input type='radio' name='commitmentTermMonths' value={value} />
                        {translate('setup.monthCount', { count: value })}
                      </label>
                    ))}
                </fieldset>
                {invalidTerms && (
                  <p role='alert' className='text-sm text-danger'>
                    {translate('subscriptionCreate.invalidTerms')}
                  </p>
                )}
              </>
            )}
            <SubscriptionExtraFields minimal allowPrimary={false} onDirty={() => {}} />
          </>
        )}
      </ItFormDialog>
      {workspaceOpen && planId && <CatalogWorkspaceSetup planId={planId} onClose={() => setWorkspaceOpen(false)} />}
    </>
  )
}
