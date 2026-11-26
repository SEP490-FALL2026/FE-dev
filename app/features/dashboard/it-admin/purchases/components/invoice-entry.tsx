import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { purchaseInvoicePreview } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-preview'
import { purchaseInvoiceSubmit } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-submit'
import { purchaseInvoiceResubmit } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-resubmit'
import { getPurchaseInvoiceListQueryKey } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-list'
import { getPurchaseInvoiceMissingPeriodListQueryKey } from '~/shared/api/generated/operations/purchase-invoices/purchase-invoice-missing-period-list'
import type {
  PurchaseInvoiceSubmitBodyDtoLink,
  PurchaseInvoicePreviewResponseDtoData
} from '~/shared/api/generated/model/purchase-invoices'
import { ItFormDialog, itButtonClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
import { formatMoney } from '~/shared/lib/money'
import { InvoiceFields, type InvoiceDraft } from './invoice-fields'
import { InvoiceDocumentUpload } from './invoice-document-upload'

export function InvoiceEntry({
  link,
  month = '',
  resubmissionId,
  onBack,
  onSubmitted
}: {
  link: PurchaseInvoiceSubmitBodyDtoLink
  month?: string
  resubmissionId?: string
  onBack: () => void
  onSubmitted: (id: string) => void
}) {
  const { t: translate, i18n } = useTranslation('itInvoices')
  const [draft, setDraft] = useState<InvoiceDraft>({
    number: '',
    issuedOn: '',
    month,
    quantity: '1',
    unitPrice: '',
    currency: 'VND',
    netAmount: '',
    deductibleTax: '',
    nonDeductibleTax: '',
    paymentSource: 'COMPANY_CARD'
  })
  const [documents, setDocuments] = useState<{ id: string; name: string }[]>([])
  const [preview, setPreview] = useState<PurchaseInvoicePreviewResponseDtoData>(null)
  const [uncertain, setUncertain] = useState(false)
  const [uploading, setUploading] = useState(true)
  const [uploadPending, setUploadPending] = useState(false)
  const formContainer = useRef<HTMLDivElement>(null)
  const feedback = useItMutationFeedback([
    getPurchaseInvoiceListQueryKey(),
    getPurchaseInvoiceMissingPeriodListQueryKey()
  ])
  function body() {
    return {
      link,
      vendorInvoiceNumber: draft.number.trim(),
      issuedOn: draft.issuedOn,
      servicePeriodMonth: draft.month,
      quantity: Number(draft.quantity),
      unitPriceOriginal: { amount: draft.unitPrice, currency: draft.currency },
      netAmount: { amount: draft.netAmount },
      paymentSource: draft.paymentSource,
      ...(draft.deductibleTax ? { deductibleTax: { amount: draft.deductibleTax } } : {}),
      ...(draft.nonDeductibleTax ? { nonDeductibleTax: { amount: draft.nonDeductibleTax } } : {})
    }
  }
  const previewMutation = useMutation({
    mutationFn: () => purchaseInvoicePreview(body()),
    onSuccess: (result) => setPreview(result.data),
    onError: feedback.onError
  })
  const submit = useMutation({
    mutationFn: () => {
      const { link: invoiceLink, ...details } = body()
      const data = { ...details, documentIds: documents.map((item) => item.id) }
      return resubmissionId
        ? purchaseInvoiceResubmit(resubmissionId, data)
        : purchaseInvoiceSubmit({ ...data, link: invoiceLink })
    },
    onSuccess: async (result) => {
      await feedback.onSuccess()
      if (result.data?.id) onSubmitted(result.data.id)
    },
    onError: async (error) => {
      if (getItError(error).key === 'unknownOutcome') setUncertain(true)
      setPreview(null)
      await feedback.onError(error)
    }
  })
  const pending = previewMutation.isPending || submit.isPending
  return (
    <div ref={formContainer}>
      <ItFormDialog
        page
        title={translate(resubmissionId ? 'resubmit' : 'submit')}
        onClose={onBack}
        pending={pending || uploadPending}
        submitLabel={translate('confirm')}
        submitDisabled={!preview || !documents.length || uncertain || uploading}
        onSubmit={(event) => {
          event.preventDefault()
          if (preview && documents.length && !pending && !uploading && !uncertain) submit.mutate()
        }}
      >
        <p className='text-sm text-muted-foreground'>{translate('sourceHint')}</p>
        <InvoiceFields
          draft={draft}
          disabled={pending || uncertain}
          onChange={(key, value) => {
            setDraft((previous) => ({ ...previous, [key]: value }))
            setPreview(null)
          }}
        />
        {uploading && documents.length < 20 && (
          <InvoiceDocumentUpload
            key={documents.length}
            onPendingChange={setUploadPending}
            onUploaded={(id, name) => {
              setDocuments((previous) => [...previous, { id, name }])
              setUploading(false)
            }}
          />
        )}
        {uploading && documents.length > 0 && (
          <button type='button' className={itButtonClass} disabled={uploadPending} onClick={() => setUploading(false)}>
            {translate('stopAdding')}
          </button>
        )}
        {documents.length > 0 && (
          <section className='space-y-2'>
            <h2 className='font-medium'>{translate('uploaded')}</h2>
            {documents.map((document) => (
              <p key={document.id} className='break-words text-sm'>
                {document.name}
              </p>
            ))}
            {documents.length < 20 && !uploading && (
              <button type='button' className={itButtonClass} onClick={() => setUploading(true)}>
                {translate('upload')}
              </button>
            )}
          </section>
        )}
        <button
          type='button'
          className={itButtonClass}
          disabled={pending || !documents.length || uncertain || uploading}
          aria-busy={previewMutation.isPending}
          onClick={() => {
            if (formContainer.current?.querySelector('form')?.reportValidity()) previewMutation.mutate()
          }}
        >
          {translate(previewMutation.isPending ? 'pending' : 'preview')}
        </button>
        {preview && (
          <section className='space-y-2 rounded-lg border border-border p-4'>
            <h2 className='font-semibold'>{translate('previewTitle')}</h2>
            <p className='text-sm text-muted-foreground'>{translate('previewHint')}</p>
            <p>
              {translate(`labels.${preview.label}`, { defaultValue: translate('unavailable') })} ·{' '}
              {preview.servicePeriodMonth}
            </p>
            {preview.periodIndex != null && (
              <p className='text-sm'>
                {translate('periodPosition', {
                  index: preview.periodIndex,
                  total: preview.periodCount ?? translate('ongoing')
                })}
              </p>
            )}
            <dl className='grid gap-3 text-sm sm:grid-cols-2'>
              <div>
                <dt className='text-muted-foreground'>{translate('chargedCostCenter')}</dt>
                <dd>{translate(preview.chargedCostCenter ? 'allocated' : 'unallocated')}</dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>{translate('commitmentRemaining')}</dt>
                <dd className='font-mono tabular-nums'>
                  {preview.commitment
                    ? formatMoney(preview.commitment.remaining, i18n.language)
                    : translate('unavailable')}
                </dd>
              </div>
            </dl>
            <p>{translate(`matches.${preview.matchResult}`, { defaultValue: translate('unavailable') })}</p>
            {preview.flags.map((flag) => (
              <p key={flag} className='text-sm text-warning-ink'>
                {translate(`flags.${flag}`, { defaultValue: translate('unavailable') })}
              </p>
            ))}
          </section>
        )}
        {uncertain && (
          <p role='status' className='text-sm text-warning-ink'>
            {translate('unknownOutcome')}
          </p>
        )}
      </ItFormDialog>
    </div>
  )
}
