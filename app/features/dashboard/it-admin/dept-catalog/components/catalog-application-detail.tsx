import { MoreHorizontal } from 'lucide-react'
import { CatalogRetirement } from './catalog-retirement'
import { CatalogPlanTerms } from './catalog-plan-terms'
import { CatalogPlanEditor } from './catalog-plan-editor'
import { CatalogSubscriptionEditor } from './catalog-subscription-editor'
import { CatalogApplicationStatus } from '../enums/application-status'
import { CatalogProvisioningType } from '../enums/provisioning-type'
import { CatalogLicenseKeys } from './catalog-license-keys'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApplicationGet } from '~/shared/api/generated/operations/applications/application-get'
import { usePlanList } from '~/shared/api/generated/operations/plans/plan-list'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { useSubscriptionSeatUsage } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import { CatalogSeatBaseline } from './catalog-seat-baseline'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { CatalogApplicationForm } from './catalog-application-form'
import { CatalogPurchaseForm } from './catalog-purchase-form'
import { ItDetailDialog } from '../../shared/components/it-detail-dialog'
function SeatUsage({ id }: { id: string }) {
  const { t: translate } = useTranslation('itCatalog')
  const query = useSubscriptionSeatUsage(id)
  return (
    <ItQueryState query={query}>
      <dl className='flex flex-wrap gap-5'>
        {(['purchased', 'occupied', 'free'] as const).map((key) => (
          <div key={key}>
            <dt className='text-xs text-muted-foreground'>{translate(key)}</dt>
            <dd className='text-right font-mono tabular-nums'>{query.data?.data?.[key] ?? translate('unknown')}</dd>
          </div>
        ))}
      </dl>
    </ItQueryState>
  )
}
export function CatalogApplicationDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { t: translate } = useTranslation('itCatalog')
  const [editing, setEditing] = useState(false)
  const [editingPlan, setEditingPlan] = useState<string>()
  const [termsPlan, setTermsPlan] = useState<string>()
  const [editingSubscription, setEditingSubscription] = useState<string>()
  const [vaultPlanId, setVaultPlanId] = useState<string>()
  const [form, setForm] = useState<'plan' | 'subscription'>()
  const [planPage, setPlanPage] = useState(1)
  const [subscriptionPage, setSubscriptionPage] = useState(1)
  const [seatId, setSeatId] = useState<string>()
  const [planId, setPlanId] = useState<string>()
  const pageRef = useRef<HTMLElement>(null)
  const application = useApplicationGet(id)
  const plans = usePlanList({ applicationId: id, page: planPage, pageSize: 20 })
  const subscriptions = useSubscriptionList({ applicationId: id, page: subscriptionPage, pageSize: 20 })
  useEffect(() => {
    pageRef.current?.focus()
  }, [vaultPlanId, termsPlan])

  if (termsPlan) return <CatalogPlanTerms planId={termsPlan} onBack={() => setTermsPlan(undefined)} />
  if (vaultPlanId)
    return (
      <section ref={pageRef} tabIndex={-1} className='space-y-5 outline-none'>
        <CatalogLicenseKeys key={vaultPlanId} planId={vaultPlanId} onBack={() => setVaultPlanId(undefined)} />
      </section>
    )
  return (
    <section ref={pageRef} tabIndex={-1} className='space-y-5 outline-none'>
      <button className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <ItQueryState query={application}>
        {application.data?.data && (
          <>
            <header className='flex flex-wrap items-center justify-between gap-3'>
              <h1
                className='min-w-0 max-w-full truncate text-2xl font-semibold tracking-tight [text-wrap:balance]'
                title={application.data.data.name}
              >
                {application.data.data.name}
              </h1>
              <button
                className={itButtonClass}
                disabled={application.data.data.status !== CatalogApplicationStatus.APPROVED}
                onClick={() => setEditing(true)}
              >
                {translate('edit')}
              </button>
            </header>
            <p>
              {translate('status')}:{' '}
              {translate(`enums.${application.data.data.status}`, { defaultValue: translate('unknown') })}
            </p>
            <p>
              {translate('owner')}: {application.data.data.businessOwner?.fullName ?? translate('unknown')}
            </p>
          </>
        )}
      </ItQueryState>
      <section className='space-y-3'>
        <header className='flex flex-wrap justify-between gap-3'>
          <h2 className='text-lg font-semibold [text-wrap:balance]'>{translate('plans')}</h2>
          <button
            className={itButtonClass}
            disabled={application.data?.data?.status !== CatalogApplicationStatus.APPROVED}
            onClick={() => setForm('plan')}
          >
            {translate('addPlan')}
          </button>
        </header>
        <ItQueryState query={plans}>
          {plans.data?.data?.items.map((plan) => (
            <article
              className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4'
              key={plan.id}
            >
              <div className='min-w-0 flex-1'>
                <button
                  className='min-h-11 max-w-full truncate text-left font-medium text-primary hover:underline'
                  title={plan.name}
                  onClick={() => setEditingPlan(plan.id)}
                >
                  {plan.name}
                </button>
                <p className='text-sm text-muted-foreground'>
                  {translate(`enums.${plan.provisioningType}`, { defaultValue: translate('unknown') })}
                </p>
              </div>
              <details className='relative'>
                <summary
                  className={itButtonClass + ' list-none cursor-pointer [&::-webkit-details-marker]:hidden'}
                  aria-label={translate('planActions')}
                >
                  <MoreHorizontal aria-hidden strokeWidth={1.5} className='size-4' />
                </summary>
                <div className='absolute right-0 z-20 mt-2 grid min-w-56 gap-1 rounded-md border border-border bg-surface p-2 shadow-lg'>
                  <button
                    className={itButtonClass}
                    disabled={
                      plan.provisioningType === 'K5' ||
                      plan.provisioningType === 'K3' ||
                      application.data?.data?.status !== CatalogApplicationStatus.APPROVED
                    }
                    onClick={() => {
                      setPlanId(plan.id)
                      setForm('subscription')
                    }}
                  >
                    {translate('addSubscription')}
                  </button>
                  {plan.provisioningType === CatalogProvisioningType.K4 && (
                    <button className={itButtonClass} onClick={() => setVaultPlanId(plan.id)}>
                      {translate('keys.title')}
                    </button>
                  )}
                  <button type='button' className={itButtonClass} onClick={() => setTermsPlan(plan.id)}>
                    {translate('terms.open')}
                  </button>
                </div>
              </details>
            </article>
          ))}
          {plans.data?.data?.items.length === 0 && <ItEmpty />}
        </ItQueryState>
        <ItPagination
          page={planPage}
          total={plans.data?.data?.pagination.totalItems ?? 0}
          pageSize={20}
          onChange={setPlanPage}
        />
      </section>
      <section className='space-y-3'>
        <h2 className='text-lg font-semibold [text-wrap:balance]'>{translate('subscriptions')}</h2>
        <ItQueryState query={subscriptions}>
          {subscriptions.data?.data?.items.map((subscription) => (
            <article className='space-y-3 rounded-lg border border-border p-4' key={subscription.id}>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <button
                    className='min-h-11 text-left font-medium text-primary hover:underline'
                    onClick={() => setEditingSubscription(subscription.id)}
                  >
                    {subscription.planName}
                  </button>
                  <p className='text-sm text-muted-foreground'>
                    {translate(`enums.${subscription.status}`, { defaultValue: translate('unknown') })}
                  </p>
                </div>
                <button className={itButtonClass} onClick={() => setSeatId(subscription.id)}>
                  {translate('seats')}
                </button>
              </div>
            </article>
          ))}
          {subscriptions.data?.data?.items.length === 0 && <ItEmpty />}
        </ItQueryState>
        <ItPagination
          page={subscriptionPage}
          total={subscriptions.data?.data?.pagination.totalItems ?? 0}
          pageSize={20}
          onChange={setSubscriptionPage}
        />
      </section>
      {seatId && (
        <ItDetailDialog title={translate('seats')} onClose={() => setSeatId(undefined)}>
          <SeatUsage id={seatId} />
        </ItDetailDialog>
      )}
      <CatalogSeatBaseline applicationId={id} applicationKind={application.data?.data?.kind} />
      <CatalogRetirement id={id} application={application.data?.data} />
      {editingPlan && <CatalogPlanEditor id={editingPlan} onClose={() => setEditingPlan(undefined)} />}
      {editingSubscription && (
        <CatalogSubscriptionEditor id={editingSubscription} onClose={() => setEditingSubscription(undefined)} />
      )}
      {editing && application.data?.data && (
        <CatalogApplicationForm application={application.data.data} onClose={() => setEditing(false)} />
      )}
      {form && (
        <CatalogPurchaseForm
          mode={form}
          applicationId={id}
          applicationKind={application.data?.data?.kind ?? ''}
          planId={planId}
          onClose={() => setForm(undefined)}
        />
      )}
    </section>
  )
}
