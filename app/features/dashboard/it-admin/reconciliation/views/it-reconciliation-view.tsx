import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useInvoiceDiscrepancyList } from '~/shared/api/generated/operations/invoice-discrepancies/invoice-discrepancy-list'
import { useVendorAccountDiscrepancyList } from '~/shared/api/generated/operations/vendor-account-discrepancies/vendor-account-discrepancy-list'
import { useOutOfProcessCaseList } from '~/shared/api/generated/operations/out-of-process-cases/out-of-process-case-list'
import { VendorAccountDiscrepancyListSource } from '~/shared/api/generated/model/vendor-account-discrepancies/vendorAccountDiscrepancyListSource'
import { VendorAccountDiscrepancyListState } from '~/shared/api/generated/model/vendor-account-discrepancies/vendorAccountDiscrepancyListState'
import { InvoiceDiscrepancyListState } from '~/shared/api/generated/model/invoice-discrepancies/invoiceDiscrepancyListState'
import { OutOfProcessCaseListState } from '~/shared/api/generated/model/out-of-process-cases/outOfProcessCaseListState'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItField, itInputClass, itButtonClass } from '../../shared/components/it-form'
import { useDashboardFormat } from '../../../dashboard-ui'
import { ReconciliationRecordDetail } from '../components/reconciliation-record-detail'
import type { ReconciliationQueue } from '../types'

export function ItReconciliationView() {
  const { t: translate } = useTranslation('itReconciliation')
  const { formatDate } = useDashboardFormat()
  const [params, setParams] = useSearchParams()
  const queue: ReconciliationQueue =
    params.get('queue') === 'invoices' ? 'invoices' : params.get('queue') === 'outside' ? 'outside' : 'vendor'
  const pageValue = Number(params.get('page') ?? 1)
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1
  const selected = params.get('id')
  const state = params.get('state') ?? 'OPEN'
  const source = Object.values(VendorAccountDiscrepancyListSource).find((value) => value === params.get('source'))
  const applicationId = params.get('applicationId') || undefined
  function update(values: Record<string, string | undefined>) {
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      for (const [key, value] of Object.entries(values)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      return next
    })
  }
  const invoices = useInvoiceDiscrepancyList(
    { page, pageSize: 20, state: Object.values(InvoiceDiscrepancyListState).find((value) => value === state) },
    { query: { enabled: queue === 'invoices' } }
  )
  const vendor = useVendorAccountDiscrepancyList(
    {
      page,
      pageSize: 20,
      source,
      applicationId,
      state: Object.values(VendorAccountDiscrepancyListState).find((value) => value === state)
    },
    { query: { enabled: queue === 'vendor' } }
  )
  const outside = useOutOfProcessCaseList(
    { page, pageSize: 20, state: Object.values(OutOfProcessCaseListState).find((value) => value === state) },
    { query: { enabled: queue === 'outside' } }
  )
  const query = queue === 'invoices' ? invoices : queue === 'vendor' ? vendor : outside
  const data = query.data?.data
  const vendorItem = queue === 'vendor' ? vendor.data?.data?.items.find((item) => item.id === selected) : undefined
  const outsideItem = queue === 'outside' ? outside.data?.data?.items.find((item) => item.id === selected) : undefined
  const invoiceItem = queue === 'invoices' ? invoices.data?.data?.items.find((item) => item.id === selected) : undefined
  if (selected) {
    const record = vendorItem
      ? { kind: 'vendor' as const, item: vendorItem }
      : outsideItem
        ? { kind: 'outside' as const, item: outsideItem }
        : invoiceItem
          ? { kind: 'invoices' as const, item: invoiceItem }
          : undefined
    return (
      <ItQueryState query={query}>
        {record ? (
          <ReconciliationRecordDetail key={selected} record={record} onBack={() => update({ id: undefined })} />
        ) : (
          <div className='space-y-4'>
            <button className={itButtonClass} onClick={() => update({ id: undefined })}>
              {translate('back')}
            </button>
            <ItEmpty />
          </div>
        )}
      </ItQueryState>
    )
  }
  const states =
    queue === 'vendor' ? Object.values(VendorAccountDiscrepancyListState) : Object.values(InvoiceDiscrepancyListState)
  return (
    <section className='space-y-5'>
      <header>
        <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('title')}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>{translate('hint')}</p>
      </header>
      <div role='group' aria-label={translate('title')} className='flex flex-wrap gap-2'>
        {(['invoices', 'vendor', 'outside'] as const).map((value) => (
          <button
            key={value}
            className={itButtonClass}
            aria-pressed={queue === value}
            onClick={() =>
              update({ queue: value, page: '1', state: 'OPEN', source: undefined, applicationId: undefined })
            }
          >
            {translate(`queues.${value}`)}
          </button>
        ))}
      </div>
      {queue === 'invoices' && <p className='text-sm text-muted-foreground'>{translate('invoiceReadOnly')}</p>}
      <div className='grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <ItChoiceSelect
          label={translate('filter')}
          value={state}
          options={[
            { value: 'ALL', label: translate('all') },
            ...states.map((value) => ({ value, label: translate(`states.${value}`) }))
          ]}
          onChange={(value) => update({ state: value, page: '1' })}
        />
        {queue === 'vendor' && (
          <>
            <ItChoiceSelect
              label={translate('source')}
              value={source ?? ''}
              options={[
                { value: '', label: translate('allSources') },
                ...Object.values(VendorAccountDiscrepancyListSource).map((value) => ({
                  value,
                  label: translate(`sources.${value}`)
                }))
              ]}
              onChange={(value) => update({ source: value || undefined, page: '1' })}
            />
            <form
              className='flex items-end gap-2 sm:col-span-2'
              onSubmit={(event) => {
                event.preventDefault()
                update({
                  applicationId:
                    String(new FormData(event.currentTarget).get('applicationId') ?? '').trim() || undefined,
                  page: '1'
                })
              }}
            >
              <ItField label={translate('applicationId')} hint={translate('applicationHint')}>
                <input
                  key={applicationId}
                  name='applicationId'
                  defaultValue={applicationId ?? ''}
                  className={itInputClass}
                  pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
                />
              </ItField>
              <button type='submit' className={itButtonClass}>
                {translate('apply')}
              </button>
            </form>
          </>
        )}
      </div>
      <ItQueryState query={query}>
        <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
          {data?.items.map((item) => (
            <article key={item.id} className='grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto]'>
              <div className='min-w-0 space-y-1'>
                <h2 className='break-words font-semibold'>
                  {'purchaseInvoice' in item
                    ? item.purchaseInvoice.vendorInvoiceNumber
                    : (item.application?.name ?? translate('unknown'))}
                </h2>
                <p className='text-sm text-muted-foreground'>{translate(`states.${item.state}`)}</p>
                {'internalValue' in item && (
                  <>
                    <p className='break-words text-sm'>{item.internalValue}</p>
                    <p className='break-words text-sm'>{item.vendorValue}</p>
                    <p className='text-right font-mono text-xs tabular-nums'>{formatDate(item.evidenceOn)}</p>
                  </>
                )}
                {'revocation' in item && item.revocation.due && (
                  <p className='text-sm text-danger'>{translate('revocationDue')}</p>
                )}
              </div>
              <button className={`${itButtonClass} self-center`} onClick={() => update({ id: item.id })}>
                {translate('details')}
              </button>
            </article>
          ))}
          {!data?.items.length && <ItEmpty />}
        </div>
      </ItQueryState>
      <ItPagination
        page={page}
        pageSize={20}
        total={data?.pagination.totalItems ?? 0}
        disabled={query.isFetching}
        onChange={(value) => update({ page: String(value) })}
      />
    </section>
  )
}
