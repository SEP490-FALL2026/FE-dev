import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useInvoiceDiscrepancyGet } from '~/shared/api/generated/operations/invoice-discrepancies/invoice-discrepancy-get'
import { formatMoney } from '~/shared/lib/money'
import { useDashboardFormat } from '../../../dashboard-ui'
import { itButtonClass } from '../../shared/components/it-form'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ReconciliationActionDialog } from './reconciliation-action-dialog'
import type { VendorDifference, OutsideCase, InvoiceDifference, ReconciliationAction } from '../types'

export function ReconciliationRecordDetail({
  record,
  onBack
}: {
  record:
    | { kind: 'vendor'; item: VendorDifference }
    | { kind: 'outside'; item: OutsideCase }
    | { kind: 'invoices'; item: InvoiceDifference }
  onBack: () => void
}) {
  const { t: translate, i18n } = useTranslation('itReconciliation')
  const { formatDate, formatDateTime } = useDashboardFormat()
  const [action, setAction] = useState<ReconciliationAction>()
  const me = useMeGet()
  const canAct =
    !me.isFetching && !me.isError && Boolean(me.data?.data?.roles.includes('IT_ADMIN')) && record.item.state === 'OPEN'
  const item = record.item
  const heading =
    record.kind === 'invoices'
      ? record.item.purchaseInvoice.vendorInvoiceNumber
      : (record.item.application?.name ?? translate('unknown'))
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <h1 className='break-words text-2xl font-semibold tracking-tight [text-wrap:balance]'>{heading}</h1>
      <p className='text-sm'>{translate(`states.${item.state}`)}</p>
      {record.kind === 'invoices' ? (
        <InvoiceComparison id={item.id} />
      ) : record.kind === 'vendor' ? (
        <>
          <dl className='grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2'>
            {(
              [
                ['identity', record.item.identity],
                ['source', translate(`sources.${record.item.source}`)],
                ['internalValue', record.item.internalValue],
                ['vendorValue', record.item.vendorValue],
                ['evidenceOn', formatDate(record.item.evidenceOn)]
              ] as const
            ).map(([key, value]) => (
              <div key={key}>
                <dt className='text-xs text-muted-foreground'>{translate(key)}</dt>
                <dd className='mt-1 break-words text-sm'>{value ?? translate('unknown')}</dd>
              </div>
            ))}
          </dl>
          {record.item.decisionNote && (
            <p className='whitespace-pre-wrap break-words text-sm'>{record.item.decisionNote}</p>
          )}
          {record.item.decision && (
            <p className='text-sm'>
              {translate('decision')}: {translate(`outcomes.${record.item.decision}`)}
            </p>
          )}
          {record.item.source === 'INVOICE_DIFFERENCE' && (
            <p className='text-sm text-muted-foreground'>{translate('invoiceOnlyFalseAlarm')}</p>
          )}
          {record.item.state === 'OPEN' && (
            <div className='flex flex-wrap gap-2'>
              <button
                className={itButtonClass}
                disabled={!canAct}
                onClick={() => setAction({ kind: 'vendor', id: item.id, decision: 'FALSE_ALARM' })}
              >
                {translate('falseAlarm')}
              </button>
              {record.item.source !== 'INVOICE_DIFFERENCE' && (
                <button
                  className={itButtonClass}
                  disabled={!canAct}
                  onClick={() => setAction({ kind: 'vendor', id: item.id, decision: 'OUT_OF_PROCESS' })}
                >
                  {translate('outside')}
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <dl className='grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2'>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('asset')}</dt>
              <dd className='mt-1 text-sm'>
                {translate(
                  record.item.companyAsset === null
                    ? 'assetUnknown'
                    : record.item.companyAsset
                      ? 'companyAsset'
                      : 'personalAsset'
                )}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-muted-foreground'>{translate('openedAt')}</dt>
              <dd className='mt-1 text-right font-mono text-sm tabular-nums'>{formatDateTime(record.item.openedAt)}</dd>
            </div>
            {record.item.amount && (
              <div>
                <dt className='text-xs text-muted-foreground'>{translate('recordedAmount')}</dt>
                <dd className='mt-1 text-right font-mono text-sm tabular-nums'>
                  {formatMoney(record.item.amount, i18n.language)}
                </dd>
              </div>
            )}
          </dl>
          <p className={`text-sm ${record.item.revocation.due ? 'text-danger' : 'text-muted-foreground'}`}>
            {translate(
              record.item.revocation.due
                ? 'revocationDue'
                : record.item.revocation.required
                  ? 'revocationWaiting'
                  : 'revocationNotRequired'
            )}
          </p>
          {record.item.revocation.waitUntil && (
            <p className='text-sm'>{translate('waitUntil', { date: formatDate(record.item.revocation.waitUntil) })}</p>
          )}
          {record.item.note && (
            <div>
              <h2 className='text-sm font-medium'>{translate('closedNote')}</h2>
              <p className='mt-1 whitespace-pre-wrap break-words text-sm'>{record.item.note}</p>
            </div>
          )}
          {record.item.outcome && (
            <p className='text-sm'>
              {translate('outcome')}: {translate(`outcomes.${record.item.outcome}`)}
            </p>
          )}
          {record.item.state === 'OPEN' && (
            <div className='flex flex-wrap gap-2'>
              {!record.item.amount && (
                <button
                  className={itButtonClass}
                  disabled={!canAct}
                  onClick={() => setAction({ kind: 'outside', id: item.id, outcome: 'FALSE_ALARM' })}
                >
                  {translate('falseAlarm')}
                </button>
              )}
              <button
                className={itButtonClass}
                disabled={!canAct}
                onClick={() => setAction({ kind: 'outside', id: item.id, outcome: 'REPORT_ONLY' })}
              >
                {translate('reportOnly')}
              </button>
              {record.item.companyAsset === true && (
                <button
                  className={itButtonClass}
                  disabled={!canAct}
                  onClick={() => setAction({ kind: 'outside', id: item.id, outcome: 'REVOKED' })}
                >
                  {translate('revoked')}
                </button>
              )}
            </div>
          )}
        </>
      )}
      {action && (
        <ReconciliationActionDialog
          action={action}
          onClose={() => {
            setAction(undefined)
          }}
          onSuccess={onBack}
        />
      )}
    </section>
  )
}

function InvoiceComparison({ id }: { id: string }) {
  const { t: translate, i18n } = useTranslation('itReconciliation')
  const query = useInvoiceDiscrepancyGet(id)
  const invoice = query.data?.data
  return (
    <ItQueryState query={query}>
      {invoice ? (
        <div className='space-y-4'>
          <p className='text-sm text-muted-foreground'>{translate('invoiceReadOnly')}</p>
          <dl className='grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2'>
            <div>
              <dt className='text-sm font-medium'>{translate('quantity')}</dt>
              <dd className='mt-1 text-sm'>
                {translate('invoiceValue')}: {invoice.quantity.invoice}
              </dd>
              <dd className='text-sm'>
                {translate('expectedValue')}: {invoice.quantity.expected ?? translate('unknown')}
              </dd>
            </div>
            <div>
              <dt className='text-sm font-medium'>{translate('unitPrice')}</dt>
              <dd className='mt-1 text-sm'>
                {translate('invoiceValue')}: {formatMoney(invoice.unitPrice.invoice, i18n.language)}
              </dd>
              <dd className='text-sm'>
                {translate('expectedValue')}:{' '}
                {invoice.unitPrice.expected
                  ? formatMoney(invoice.unitPrice.expected, i18n.language)
                  : translate('unknown')}
              </dd>
            </div>
          </dl>
          {invoice.closure && <p className='whitespace-pre-wrap break-words text-sm'>{invoice.closure.reason}</p>}
          <a
            className={itButtonClass}
            href={`/dashboard/it-admin?tab=purchase-invoices&invoiceId=${encodeURIComponent(invoice.purchaseInvoice.id)}`}
          >
            {translate('originalInvoice')}
          </a>
        </div>
      ) : (
        <ItEmpty />
      )}
    </ItQueryState>
  )
}
