import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePurchaseInvoiceGet } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-get'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'
import { useDashboardFormat } from '../../../dashboard-ui'
import { formatMoney } from '~/shared/lib/money'
import { ItEmpty, ItQueryState } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'
import { DocumentDetail } from './document-detail'
import { InvoiceEntry } from './invoice-entry'

export function InvoiceDetail({
  id,
  onBack,
  onSubmitted
}: {
  id: string
  onBack: () => void
  onSubmitted: (id: string) => void
}) {
  const { t: translate, i18n } = useTranslation('itInvoices')
  const { formatDate } = useDashboardFormat()
  const query = usePurchaseInvoiceGet(id)
  const me = useMeGet()
  const invoice = query.data?.data
  const [documentId, setDocumentId] = useState('')
  const [resubmitting, setResubmitting] = useState(false)
  const canResubmit =
    invoice?.state === 'RETURNED' &&
    !invoice.resubmittedAsId &&
    me.data?.data?.employee.id === invoice.submittedBy.employeeId
  if (resubmitting && invoice && canResubmit)
    return (
      <InvoiceEntry
        resubmissionId={invoice.id}
        link={
          invoice.linkKind === 'REQUEST'
            ? { requestId: invoice.requestId ?? undefined }
            : { subscriptionId: invoice.subscriptionId ?? undefined }
        }
        month={invoice.servicePeriodMonth}
        onBack={() => setResubmitting(false)}
        onSubmitted={(nextId) => {
          setResubmitting(false)
          onSubmitted(nextId)
        }}
      />
    )
  if (documentId)
    return (
      <section className='space-y-5'>
        <button type='button' className={itButtonClass} onClick={() => setDocumentId('')}>
          {translate('back')}
        </button>
        <DocumentDetail id={documentId} />
      </section>
    )
  return (
    <section className='space-y-5'>
      <button type='button' className={itButtonClass} onClick={onBack}>
        {translate('back')}
      </button>
      <ItQueryState query={query}>
        {invoice ? (
          <>
            <h1 className='text-2xl font-semibold'>{invoice.vendorInvoiceNumber}</h1>
            <p>{translate(`states.${invoice.state}`, { defaultValue: translate('unavailable') })}</p>
            <dl className='grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2'>
              <div>
                <dt>{translate('issuedOn')}</dt>
                <dd className='text-right font-mono tabular-nums'>{formatDate(invoice.issuedOn)}</dd>
              </div>
              <div>
                <dt>{translate('month')}</dt>
                <dd className='text-right font-mono tabular-nums'>{invoice.servicePeriodMonth}</dd>
              </div>
              <div>
                <dt>{translate('quantity')}</dt>
                <dd className='text-right font-mono tabular-nums'>{invoice.quantity}</dd>
              </div>
              <div>
                <dt>{translate('amount')}</dt>
                <dd className='text-right font-mono tabular-nums'>{formatMoney(invoice.netAmount, i18n.language)}</dd>
              </div>
              <div>
                <dt>{translate('paymentSource')}</dt>
                <dd>{translate(`sources.${invoice.paymentSource}`, { defaultValue: translate('unavailable') })}</dd>
              </div>
            </dl>
            <p>{translate(`matches.${invoice.matchResult}`, { defaultValue: translate('unavailable') })}</p>
            {invoice.flags.map((flag) => (
              <p key={flag} className='text-sm text-warning-ink'>
                {translate(`flags.${flag}`, { defaultValue: translate('unavailable') })}
              </p>
            ))}
            {invoice.returnReason && (
              <section>
                <h2 className='font-semibold'>{translate('returnReason')}</h2>
                <p className='whitespace-pre-wrap text-sm'>{invoice.returnReason}</p>
              </section>
            )}
            <section className='space-y-2'>
              <h2 className='font-semibold'>{translate('uploaded')}</h2>
              {invoice.documents.map((document) => (
                <button
                  key={document.documentId}
                  type='button'
                  className={itButtonClass}
                  onClick={() => setDocumentId(document.documentId)}
                >
                  {translate('document')} {document.position}
                </button>
              ))}
            </section>
            {canResubmit && (
              <button
                type='button'
                className={itButtonClass}
                disabled={query.isFetching}
                onClick={() => setResubmitting(true)}
              >
                {translate('resubmit')}
              </button>
            )}
          </>
        ) : (
          <ItEmpty />
        )}
      </ItQueryState>
    </section>
  )
}
