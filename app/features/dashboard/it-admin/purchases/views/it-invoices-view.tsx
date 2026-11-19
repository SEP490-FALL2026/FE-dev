import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { ItPageHeader, ItSegmented } from '../../shared/components/it-page-header'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { usePurchaseInvoiceList } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-list'
import { usePurchaseInvoiceMissingPeriodList } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-missing-period-list'
import { useSubscriptionList } from '~/shared/api/generated/operations/subscriptions/subscription-list'
import type {
  PurchaseInvoiceListState,
  PurchaseInvoiceSubmitBodyDtoLink
} from '~/shared/api/generated/model/purchase-invoices'
import { useDashboardFormat } from '../../../dashboard-ui'
import { formatMoney } from '~/shared/lib/money'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { itButtonClass } from '../../shared/components/it-form'
import { InvoiceEntry } from '../components/invoice-entry'
import { InvoiceDetail } from '../components/invoice-detail'

export function ItInvoicesView() {
  const { t: translate, i18n } = useTranslation('itInvoices')
  const { formatDate } = useDashboardFormat()
  const [params, setParams] = useSearchParams()
  const view = params.get('view') === 'missing' ? 'missing' : params.get('view') === 'new' ? 'new' : 'history'
  const page = Math.max(1, Number(params.get('page')) || 1)
  const state = (['SUBMITTED', 'CONFIRMED', 'RETURNED'] as const).find((value) => value === params.get('state'))
  const [entry, setEntry] = useState<{ link: PurchaseInvoiceSubmitBodyDtoLink; month?: string } | undefined>(() =>
    params.get('requestId') ? { link: { requestId: params.get('requestId') ?? undefined } } : undefined
  )
  const invoiceId = params.get('invoiceId') ?? ''
  const invoices = usePurchaseInvoiceList(
    { page, pageSize: 20, state },
    { query: { enabled: !entry && !invoiceId && view === 'history' } }
  )
  const missing = usePurchaseInvoiceMissingPeriodList(
    { page, pageSize: 20 },
    { query: { enabled: !entry && !invoiceId && view === 'missing' } }
  )
  const subscriptions = useSubscriptionList(
    { page, pageSize: 20, status: 'ACTIVE' },
    { query: { enabled: !entry && !invoiceId && view === 'new' } }
  )
  function update(values: Record<string, string>) {
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      Object.entries(values).forEach(([key, value]) => {
        if (value) next.set(key, value)
        else next.delete(key)
      })
      return next
    })
  }
  if (entry)
    return (
      <InvoiceEntry
        link={entry.link}
        month={entry.month}
        onBack={() => setEntry(undefined)}
        onSubmitted={(id) => {
          setEntry(undefined)
          update({ invoiceId: id })
        }}
      />
    )
  if (invoiceId)
    return (
      <InvoiceDetail
        id={invoiceId}
        onBack={() => update({ invoiceId: '' })}
        onSubmitted={(id) => update({ invoiceId: id })}
      />
    )
  const query = view === 'missing' ? missing : view === 'new' ? subscriptions : invoices
  return (
    <section className='space-y-5'>
      <ItPageHeader icon={Receipt} title={translate('title')} subtitle={translate('subtitle')}>
        <ItSegmented
          label={translate('title')}
          value={view}
          items={(['history', 'missing', 'new'] as const).map((key) => ({
            key,
            label: translate(key === 'new' ? 'newInvoice' : key)
          }))}
          onChange={(value) => update({ view: value, page: '1' })}
        />
      </ItPageHeader>
      {view === 'history' && (
        <div className='soft-panel flex flex-wrap gap-2 p-3' role='group' aria-label={translate('all')}>
          {([undefined, 'SUBMITTED', 'CONFIRMED', 'RETURNED'] as const).map(
            (value: PurchaseInvoiceListState | undefined) => (
              <button
                key={value ?? 'all'}
                type='button'
                className={itButtonClass}
                aria-pressed={state === value}
                onClick={() => update({ state: value ?? '', page: '1' })}
              >
                {value ? translate(`states.${value}`) : translate('all')}
              </button>
            )
          )}
        </div>
      )}
      <ItQueryState query={query}>
        <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
          {view === 'history' &&
            invoices.data?.data?.items.map((item) => (
              <article key={item.id} className='flex flex-wrap items-center justify-between gap-3 p-4'>
                <div>
                  <h2 className='font-medium'>{item.vendorInvoiceNumber}</h2>
                  <p className='text-sm text-muted-foreground'>
                    {item.servicePeriodMonth} ·{' '}
                    {translate(`states.${item.state}`, { defaultValue: translate('unavailable') })}
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <p className='text-right font-mono text-sm font-medium tabular-nums'>
                    {formatMoney(item.netAmount, i18n.language)}
                  </p>
                  <button type='button' className={itButtonClass} onClick={() => update({ invoiceId: item.id })}>
                    {translate('open')}
                  </button>
                </div>
              </article>
            ))}
          {view === 'missing' &&
            missing.data?.data?.items.map((item) => (
              <article
                key={`${item.requestId ?? item.subscriptionId}-${item.servicePeriodMonth}`}
                className='flex flex-wrap items-center justify-between gap-3 p-4'
              >
                <div>
                  <h2 className='font-medium'>
                    {item.plan.applicationName} · {item.plan.planName}
                  </h2>
                  <p className='text-sm'>
                    {item.servicePeriodMonth} · {item.department?.name}
                  </p>
                  <p className='text-right font-mono text-xs tabular-nums'>
                    {translate('due')}: {formatDate(item.dueDate)}
                  </p>
                </div>
                <button
                  type='button'
                  className={itButtonClass}
                  onClick={() =>
                    setEntry({
                      link:
                        item.linkKind === 'REQUEST' && item.requestId
                          ? { requestId: item.requestId }
                          : { subscriptionId: item.subscriptionId ?? undefined },
                      month: item.servicePeriodMonth
                    })
                  }
                >
                  {translate('submit')}
                </button>
              </article>
            ))}
          {view === 'new' &&
            subscriptions.data?.data?.items.map((item) => (
              <article key={item.id} className='flex flex-wrap items-center justify-between gap-3 p-4'>
                <h2 className='font-medium'>
                  {item.applicationName} · {item.planName}
                </h2>
                <button
                  type='button'
                  className={itButtonClass}
                  onClick={() => setEntry({ link: { subscriptionId: item.id } })}
                >
                  {translate('submit')}
                </button>
              </article>
            ))}
          {!query.data?.data?.items.length && <ItEmpty />}
        </div>
      </ItQueryState>
      <ItPagination
        page={page}
        pageSize={20}
        total={query.data?.data?.pagination.totalItems ?? 0}
        onChange={(value) => update({ page: String(value) })}
      />
    </section>
  )
}
