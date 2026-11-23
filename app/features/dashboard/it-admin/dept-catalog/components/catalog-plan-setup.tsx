import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PlanResponseDtoData } from '~/shared/api/generated/model/plans'
import { itButtonClass, itPrimaryClass } from '../../shared/components/it-form'
import { CatalogPurchaseForm } from './catalog-purchase-form'
import { CatalogSubscriptionEditor } from './catalog-subscription-editor'
import { CatalogWorkspaceSetup } from './catalog-workspace-setup'
import { CatalogPlanTerms } from './catalog-plan-terms'
import { CatalogPlanSubscriptions } from './catalog-plan-subscriptions'

export type SetupPlan = Pick<
  NonNullable<PlanResponseDtoData>,
  'id' | 'applicationId' | 'applicationName' | 'name' | 'provisioningType' | 'hasAdminConsole'
>
export function CatalogPlanSetup({
  plan,
  applicationKind,
  onBack
}: {
  plan: SetupPlan
  applicationKind: string
  onBack: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [view, setView] = useState<'summary' | 'subscription' | 'workspace' | 'terms'>('summary')
  const [subscriptionId, setSubscriptionId] = useState('')
  if (subscriptionId) return <CatalogSubscriptionEditor id={subscriptionId} onClose={() => setSubscriptionId('')} />
  if (view === 'terms') return <CatalogPlanTerms planId={plan.id} onBack={() => setView('summary')} />
  if (view === 'workspace') return <CatalogWorkspaceSetup planId={plan.id} onClose={() => setView('summary')} />
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <header>
        <h1 className='text-2xl font-semibold'>
          {plan.applicationName} · {plan.name}
        </h1>
        <p className='text-sm text-muted-foreground'>
          {translate(`applicationProvisionValues.${plan.provisioningType}`, { defaultValue: translate('unknown') })}
        </p>
      </header>
      <p className='text-sm text-muted-foreground'>{translate('setup.intro')}</p>
      {plan.provisioningType !== 'K5' && <CatalogPlanSubscriptions planId={plan.id} onEdit={setSubscriptionId} />}
      {(plan.provisioningType === 'K1' || plan.provisioningType === 'K2' || plan.provisioningType === 'K4') && (
        <article className='space-y-2 rounded-lg border border-border bg-surface p-4'>
          <h2 className='font-semibold'>{translate('setup.subscription')}</h2>
          <p className='text-sm text-muted-foreground'>{translate('setup.subscriptionHint')}</p>
          <button type='button' className={itPrimaryClass} onClick={() => setView('subscription')}>
            {translate('addSubscription')}
          </button>
        </article>
      )}
      {(plan.provisioningType === 'K2' || (plan.provisioningType === 'K4' && plan.hasAdminConsole)) && (
        <article className='space-y-2 rounded-lg border border-border bg-surface p-4'>
          <h2 className='font-semibold'>{translate('setup.workspace')}</h2>
          <p className='text-sm text-muted-foreground'>{translate('setup.workspaceHint')}</p>
          <button type='button' className={itButtonClass} onClick={() => setView('workspace')}>
            {translate('setup.openWorkspace')}
          </button>
        </article>
      )}
      <article className='space-y-2 rounded-lg border border-border bg-surface p-4'>
        <h2 className='font-semibold'>{translate('setup.terms')}</h2>
        <button type='button' className={itButtonClass} onClick={() => setView('terms')}>
          {translate('terms.open')}
        </button>
      </article>
      {view === 'subscription' && (
        <CatalogPurchaseForm
          mode='subscription'
          applicationId={plan.applicationId}
          applicationKind={applicationKind}
          planId={plan.id}
          onClose={() => setView('summary')}
          onSubscriptionCreated={() => {
            setView('summary')
          }}
        />
      )}
    </section>
  )
}
