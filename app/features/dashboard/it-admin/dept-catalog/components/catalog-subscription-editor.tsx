import { useQueryClient } from '@tanstack/react-query'
import { useCatalogEditorSnapshot } from '../hooks/use-catalog-editor-snapshot'
import { getSubscriptionSeatUsageQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-seat-usage'
import { env } from '~/shared/config/env'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDashboardFormat } from '../../../dashboard-ui'
import { NoticeDeadlineSource } from '../enums/notice-deadline-source'
import { useSubscriptionGet } from '~/shared/api/generated/operations/subscriptions/subscription-get'
import { useSubscriptionUpdate } from '~/shared/api/generated/operations/subscriptions/subscription-update'
import { useSubscriptionComplete } from '~/shared/api/generated/operations/subscriptions/subscription-complete'
import { getSubscriptionListQueryKey } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import { UpdateSubscriptionBodyDtoBillingCycle } from '~/shared/api/generated/model/subscriptions/updateSubscriptionBodyDtoBillingCycle'
import type { SubscriptionResponseDtoData, UpdateSubscriptionBodyDto } from '~/shared/api/generated/model/subscriptions'
import { CatalogSubscriptionStatus } from '../enums/subscription-status'
import { ItQueryState } from '../../shared/components/it-query-state'
import { ItField, ItFormDialog, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
export function CatalogSubscriptionEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const query = useSubscriptionGet(id, { query: { staleTime: 0, refetchOnMount: 'always' } })
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
          onClose={onClose}
          queryKey={query.queryKey}
          blocked={editor.blocked}
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
  onClose,
  queryKey,
  blocked,
  onDirty,
  changed,
  onReload
}: {
  subscription: NonNullable<SubscriptionResponseDtoData>
  onClose: () => void
  queryKey: readonly unknown[]
  blocked: boolean
  onDirty: () => void
  changed: boolean
  onReload: () => void
}) {
  const { t: translate } = useTranslation('itCatalog')
  const { formatDate } = useDashboardFormat()
  const [priceError, setPriceError] = useState(false)
  const [dirty, setDirty] = useState(false)
  const queryClient = useQueryClient()
  const previewKeys = queryClient
    .getQueryCache()
    .findAll({ type: 'active' })
    .filter(
      (query) =>
        typeof query.queryKey[0] === 'string' &&
        query.queryKey[0].startsWith(`${env.API_BASE_URL}/api/v1/seat-baseline-imports/`)
    )
    .map((query) => query.queryKey)
  const affected = [
    ...previewKeys,
    getSubscriptionListQueryKey(),
    queryKey,
    getSubscriptionSeatUsageQueryKey(subscription.id),
    [`${env.API_BASE_URL}/api/v1/seat-baseline-imports`]
  ]
  const feedback = useItMutationFeedback(affected, onClose)
  const update = useSubscriptionUpdate({ mutation: feedback })
  const completeFeedback = useItMutationFeedback(affected)
  const complete = useSubscriptionComplete({ mutation: completeFeedback })
  const pending = update.isPending || complete.isPending
  const canComplete =
    subscription.status === CatalogSubscriptionStatus.DRAFT &&
    subscription.missing.every((value) => value === 'EXCHANGE_RATE')
  return (
    <ItFormDialog
      wide
      title={translate('editSubscription')}
      pending={pending}
      submitDisabled={blocked}
      submitLabel={translate('save')}
      onClose={onClose}
      onSubmit={(event) => {
        event.preventDefault()
        if (blocked || pending) return
        const values = new FormData(event.currentTarget)
        const read = (key: string) => String(values.get(key) ?? '').trim()
        const quantity = read('quantity')
        const amount = read('amount')
        const currency = read('currency')
        const billingCycle = Object.values(UpdateSubscriptionBodyDtoBillingCycle).find(
          (value) => value === values.get('billingCycle')
        )
        setPriceError(!!amount !== !!currency)
        if (!!amount !== !!currency) return
        const data: UpdateSubscriptionBodyDto = {
          ...(quantity ? { purchasedQuantity: Number(quantity) } : {}),
          ...(amount && currency ? { unitPrice: { amount, currency } } : {}),
          ...(billingCycle ? { billingCycle } : {}),
          ...(read('startDate') ? { startDate: read('startDate') } : {}),
          endDate: read('endDate') || null,
          renewalDate: read('renewalDate') || null,
          noticeDeadline: read('noticeDeadline') || null,
          noticePeriodDays: read('noticePeriodDays') ? Number(read('noticePeriodDays')) : null,
          autoRenew: values.has('autoRenew'),
          allowsMidTermReduction: values.has('allowsMidTermReduction')
        }
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
        className='grid gap-4 sm:grid-cols-2'
        onChange={() => {
          setDirty(true)
          onDirty()
        }}
      >
        <ItField label={translate('quantity')}>
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
        <ItField label={translate('unitAmount')} error={priceError ? translate('pricePair') : undefined}>
          <input
            placeholder={translate('placeholders.amount')}
            name='amount'
            inputMode='decimal'
            pattern='[0-9]+([.][0-9]+)?'
            maxLength={40}
            defaultValue={subscription.unitPrice?.amount ?? ''}
            className={itInputClass}
          />
        </ItField>
        <ItField label={translate('currency')}>
          <input
            placeholder={translate('placeholders.currency')}
            name='currency'
            pattern='[A-Z]{3}'
            maxLength={3}
            defaultValue={subscription.unitPrice?.currency ?? ''}
            className={itInputClass}
          />
        </ItField>
        {(['startDate', 'endDate', 'renewalDate'] as const).map((key) => (
          <ItField key={key} label={translate(key)}>
            <input name={key} type='date' defaultValue={subscription[key] ?? ''} className={itInputClass} />
          </ItField>
        ))}
        <ItField label={translate('deadline.declared')} hint={translate('deadline.hint')}>
          <input
            name='noticeDeadline'
            type='date'
            defaultValue={
              subscription.noticeDeadline?.source === NoticeDeadlineSource.DECLARED
                ? (subscription.noticeDeadline.value ?? '')
                : ''
            }
            className={itInputClass}
          />
        </ItField>
        <ItField label={translate('noticePeriodDays')}>
          <input
            placeholder={translate('placeholders.days')}
            name='noticePeriodDays'
            type='number'
            min={0}
            max={3650}
            step={1}
            defaultValue={subscription.noticePeriodDays ?? ''}
            className={itInputClass}
          />
        </ItField>
      </div>
      {subscription.noticeDeadline && (
        <dl className='grid gap-3 rounded-md bg-surface-subtle p-3 text-sm sm:grid-cols-2'>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('deadline.effective')}</dt>
            <dd className='mt-1 text-right font-mono tabular-nums'>
              {subscription.noticeDeadline.value ? formatDate(subscription.noticeDeadline.value) : translate('unknown')}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-muted-foreground'>{translate('deadline.source')}</dt>
            <dd className='mt-1'>
              {translate(`deadline.values.${subscription.noticeDeadline.source}`, {
                defaultValue: translate('unknown')
              })}
            </dd>
          </div>
        </dl>
      )}
      <fieldset
        onChange={() => {
          setDirty(true)
          onDirty()
        }}
      >
        <legend>{translate('billingCycle')}</legend>
        {Object.values(UpdateSubscriptionBodyDtoBillingCycle).map((value) => (
          <label key={value} className='mr-4 inline-flex min-h-11 items-center gap-2'>
            <input
              type='radio'
              name='billingCycle'
              value={value}
              defaultChecked={value === subscription.billingCycle}
            />
            {translate(`enums.${value}`, { defaultValue: translate('unknown') })}
          </label>
        ))}
      </fieldset>
      {(['autoRenew', 'allowsMidTermReduction'] as const).map((key) => (
        <label key={key} className='flex min-h-11 items-center gap-2'>
          <input
            type='checkbox'
            name={key}
            defaultChecked={subscription[key]}
            onChange={() => {
              setDirty(true)
              onDirty()
            }}
          />
          {translate(key)}
        </label>
      ))}
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
    </ItFormDialog>
  )
}
