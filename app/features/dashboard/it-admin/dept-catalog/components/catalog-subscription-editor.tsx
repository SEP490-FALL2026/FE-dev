import { useCatalogEditorSnapshot } from '../hooks/use-catalog-editor-snapshot'
import { getSubscriptionSeatUsageQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscriptionGet } from '~/shared/api/generated/operations/subscriptions/subscription-get'
import { usePlanGet } from '~/shared/api/generated/operations/plans/plan-get'
import { useSubscriptionUpdate } from '~/shared/api/generated/operations/subscriptions/subscription-update'
import { useSubscriptionComplete } from '~/shared/api/generated/operations/subscriptions/subscription-complete'
import { getSubscriptionListQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { SubscriptionBillingFields } from './subscription-billing-fields'
import type { SubscriptionResponseDtoData } from '~/shared/api/generated/model/subscriptions'
import { buildSubscriptionUpdate } from '../subscription-update'
import { SubscriptionExtraFields } from './subscription-extra-fields'
import { CatalogSubscriptionStatus } from '../enums/subscription-status'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
export function CatalogSubscriptionEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const query = useSubscriptionGet(id, { query: { staleTime: 0, refetchOnMount: 'always' } })
  const plan = usePlanGet(query.data?.data?.planId ?? '', { query: { enabled: !!query.data?.data?.planId } })
  const editor = useCatalogEditorSnapshot(query)
  return (
    <ItQueryState
      query={
        editor.snapshot
          ? { ...query, isPending: false, isError: false }
          : { ...query, isPending: query.isPending || query.isFetching }
      }
    >
      {editor.snapshot && (
        <SubscriptionFields
          key={editor.version}
          subscription={editor.snapshot}
          planType={plan.data?.data?.provisioningType}
          onClose={onClose}
          queryKey={query.queryKey}
          blocked={editor.blocked || !plan.data?.data || plan.isError || plan.isFetching}
          onDirty={editor.markDirty}
          changed={editor.changed || query.isError}
          onReload={() => {
            if (query.isError) void query.refetch()
            else editor.reload()
          }}
        />
      )}
    </ItQueryState>
  )
}
function SubscriptionFields({
  subscription,
  planType,
  onClose,
  queryKey,
  blocked,
  onDirty,
  changed,
  onReload
}: {
  subscription: NonNullable<SubscriptionResponseDtoData>
  planType?: string
  onClose: () => void
  queryKey: readonly unknown[]
  blocked: boolean
  onDirty: () => void
  changed: boolean
  onReload: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const [dirty, setDirty] = useState(false)
  const [termError, setTermError] = useState<'invalidTerms' | 'k1Terms'>()
  const affected = [getSubscriptionListQueryKey(), queryKey, getSubscriptionSeatUsageQueryKey(subscription.id)]
  const feedback = useItMutationFeedback(affected, onClose)
  const update = useSubscriptionUpdate({ mutation: feedback })
  const completeFeedback = useItMutationFeedback(affected)
  const complete = useSubscriptionComplete({ mutation: completeFeedback })
  const pending = update.isPending || complete.isPending
  const canComplete = subscription.status === CatalogSubscriptionStatus.DRAFT && subscription.missing.length === 0
  return (
    <ItFormDialog
      wide
      title={translate('editSubscription')}
      pending={pending}
      submitDisabled={blocked || !dirty}
      submitLabel={translate('save')}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (blocked || pending) return
        const values = new FormData(event.currentTarget)
        const data = buildSubscriptionUpdate(values, subscription)
        if (!Object.keys(data).length) return
        const cycle = data.billingCycle ?? subscription.billingCycle
        const commitment = data.commitmentTermMonths ?? subscription.commitmentTermMonths
        if (planType === 'K1' && ((cycle && cycle !== 'MONTHLY') || (commitment && commitment !== 1))) {
          setTermError('k1Terms')
          return
        }
        if (cycle === 'ANNUAL' && commitment === 1) {
          setTermError('invalidTerms')
          return
        }
        setTermError(undefined)
        update.mutate({ id: subscription.id, data })
      }}
    >
      {changed && (
        <div className='space-y-2'>
          <p role='status'>{translate('remoteChanged')}</p>
          <button type='button' className={itButtonClass} onClick={onReload}>
            {translate('reloadLatest')}
          </button>
        </div>
      )}
      <p className='text-sm'>
        {subscription.planName} · {translate(`enums.${subscription.status}`, { defaultValue: translate('unknown') })}
      </p>
      {subscription.missing.length > 0 && (
        <div className='space-y-1'>
          <p className='text-sm font-medium'>{translate('missingData')}</p>
          {subscription.missing.map((key) => (
            <p className='text-sm text-muted-foreground' key={key}>
              {translate(`missing.${key}`, { defaultValue: translate('unknown') })}
            </p>
          ))}
        </div>
      )}
      <div
        className='grid gap-4 sm:grid-cols-2 [&>.it-form-field]:row-span-3 [&>.it-form-field]:grid-rows-subgrid'
        onChange={() => {
          setDirty(true)
          onDirty()
        }}
      >
        <ItField label={translate('quantity')} hint={translate('help.quantity')}>
          <input
            placeholder={translate('placeholders.quantity')}
            name='quantity'
            type='number'
            min={0}
            max={1000000000}
            step={1}
            defaultValue={subscription.purchasedQuantity ?? ''}
            className={itInputClass}
          />
        </ItField>
        <ItField label={translate('unitAmount')} hint={translate('help.unitAmount')}>
          <input
            placeholder={translate('placeholders.amount')}
            name='amount'
            inputMode='numeric'
            pattern='[0-9]{1,16}'
            maxLength={16}
            defaultValue={subscription.unitPrice?.currency === 'VND' ? subscription.unitPrice.amount : ''}
            className={itInputClass}
          />
        </ItField>
        {subscription.unitPrice && subscription.unitPrice.currency !== 'VND' && (
          <p className='text-sm text-muted-foreground sm:col-span-2'>
            {translate('subscriptionExtra.legacyPrice', {
              amount: subscription.unitPrice.amount,
              currency: subscription.unitPrice.currency
            })}
          </p>
        )}
        <ItField label={translate('startDate')} hint={translate('help.startDate')}>
          <input name='startDate' type='date' defaultValue={subscription.startDate ?? ''} className={itInputClass} />
        </ItField>
      </div>
      <SubscriptionBillingFields
        subscription={subscription}
        planType={planType}
        onDirty={() => {
          setDirty(true)
          onDirty()
        }}
      />
      {termError && (
        <p role='alert' className='text-sm text-danger'>
          {translate(`subscriptionCreate.${termError}`)}
        </p>
      )}
      <SubscriptionExtraFields
        subscription={subscription}
        minimal
        allowPrimary={false}
        onDirty={() => {
          setDirty(true)
          onDirty()
        }}
      />
      {subscription.status === CatalogSubscriptionStatus.DRAFT && (
        <>
          <p className='text-xs text-muted-foreground'>
            {translate(subscription.missing.length > 0 && canComplete ? 'fxRecoveryHint' : 'completeHint')}
          </p>
          <button
            type='button'
            className={itButtonClass}
            disabled={!canComplete || pending || dirty || blocked}
            aria-busy={complete.isPending}
            onClick={() => complete.mutate({ id: subscription.id })}
          >
            {translate(complete.isPending ? 'activating' : 'activate')}
          </button>
        </>
      )}
    </ItFormDialog>
  )
}
