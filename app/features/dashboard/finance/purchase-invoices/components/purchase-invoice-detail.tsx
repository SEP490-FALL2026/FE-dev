import { AlertTriangle, FileText } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getPurchaseInvoiceGetQueryKey,
  getPurchaseInvoiceListQueryKey,
  usePurchaseInvoiceConfirm,
  usePurchaseInvoiceGet,
  usePurchaseInvoiceReturn
} from '~/shared/api/generated/operations/purchase-invoices'
import { useCostCenterList } from '~/shared/api/generated/operations/cost-centers'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import {
  FinanceButton,
  FinanceDetailPage,
  FinanceField,
  FinancePage,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { formatMoney } from '../../shared/finance-money'
import { invoiceLabelText, invoiceSpend } from '../invoice-label'
import { useDocumentLink } from '../hooks/use-document-link'
import { usePurchasesFeedback } from '../hooks/use-purchases-feedback'

interface Props {
  id: string
  onBack: () => void
  onOpenInvoice?: (invoiceId: string) => void
  onOpenRequest?: (requestId: string) => void
}

export function PurchaseInvoiceDetail({ id, onBack, onOpenInvoice, onOpenRequest }: Props) {
  const { t: translate, i18n } = useTranslation('financePurchases')
  const query = usePurchaseInvoiceGet(id)
  const invoice = query.data?.data
  const [returning, setReturning] = useState(false)
  const [signing, setSigning] = useState(false)
  const link = useDocumentLink()
  const costCenters = useCostCenterList(
    { pageSize: 100 },
    { query: { enabled: Boolean(invoice?.chargedCostCenterId) } }
  )
  const dateTime = (value: string) => new Date(value).toLocaleString(i18n.language)
  const money = (value: { amount: string; currency: string } | null) =>
    value ? formatMoney(value, i18n.language) : translate('none')
  const awaiting = invoice?.state === 'SUBMITTED'
  const chargedCostCenter = invoice?.chargedCostCenterId
    ? costCenters.data?.data?.items.find((item) => item.id === invoice.chargedCostCenterId)
    : null

  return (
    <FinanceDetailPage>
      <FinancePage
        title={translate('invoice.detailTitle', { number: invoice?.vendorInvoiceNumber ?? '' })}
        actions={
          <>
            <FinanceButton variant='ghost' onClick={onBack}>
              {translate('back')}
            </FinanceButton>
            {awaiting && (
              <>
                <FinanceButton onClick={() => setReturning(true)}>{translate('invoice.return')}</FinanceButton>
                <FinanceButton variant='primary' onClick={() => setSigning(true)}>
                  {translate('invoice.confirm')}
                </FinanceButton>
              </>
            )}
          </>
        }
      >
        <FinanceQueryState query={query} skeleton='detail'>
          {invoice && (
            <>
              <div className='flex flex-wrap items-center gap-3'>
                <FinanceStatus value={invoice.state} label={translate(`invoice.states.${invoice.state}`)} />
                <FinanceStatus
                  value={invoice.matchResult === 'MATCHED' ? 'ACTIVE' : 'PENDING'}
                  label={translate(`invoice.matches.${invoice.matchResult}`)}
                />
                {invoice.flags.map((flag) => (
                  <FinanceStatus key={flag} value='PENDING' label={translate(`invoice.flagNames.${flag}`)} />
                ))}
              </div>
              {((awaiting && invoice.matchResult === 'PRICE_QUANTITY_EXCEPTION') || invoice.flags.length > 0) && (
                <section
                  role='status'
                  className='flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-ink'
                >
                  <AlertTriangle aria-hidden className='mt-0.5 size-5 shrink-0' strokeWidth={1.5} />
                  <div className='space-y-1.5'>
                    <h2 className='font-semibold'>{translate('ui.reviewNotes')}</h2>
                    <ul className='list-inside list-disc space-y-1 leading-relaxed'>
                      {awaiting && invoice.matchResult === 'PRICE_QUANTITY_EXCEPTION' && (
                        <li>{translate('invoice.exceptionWarning')}</li>
                      )}
                      {invoice.flags.map((flag) => (
                        <li key={flag}>{translate(`invoice.flagHints.${flag}`)}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
              {awaiting && (
                <p className='text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]'>
                  {translate('invoice.confirmHint')}
                </p>
              )}
              {invoice.state === 'RETURNED' && (
                <p role='status' className='text-sm text-muted-foreground'>
                  {invoice.resubmittedAsId ? translate('invoice.resubmitted') : translate('invoice.notResubmitted')}
                </p>
              )}
              <FinanceSection title={translate('ui.amounts')}>
                <FinanceStatGrid columns={4}>
                  <FinanceStat
                    label={translate('invoice.spendAmount')}
                    value={money(invoiceSpend(invoice.netAmount, invoice.nonDeductibleTax))}
                    emphasis
                  />
                  <FinanceStat label={translate('invoice.netAmount')} value={money(invoice.netAmount)} />
                  <FinanceStat label={translate('invoice.deductibleTax')} value={money(invoice.deductibleTax)} />
                  <FinanceStat label={translate('invoice.nonDeductibleTax')} value={money(invoice.nonDeductibleTax)} />
                </FinanceStatGrid>
              </FinanceSection>
              <FinanceSection title={translate('ui.invoiceInfo')}>
                <dl className='grid gap-x-8 gap-y-3 rounded-xl border border-border/70 bg-surface p-4 text-sm sm:grid-cols-2 sm:p-5'>
                  <Row
                    label={translate('invoice.label')}
                    value={invoiceLabelText(translate, invoice.label, invoice.periodIndex, invoice.periodCount)}
                  />
                  <Row label={translate('invoice.servicePeriodMonth')} value={invoice.servicePeriodMonth} />
                  <Row label={translate('invoice.issuedOn')} value={invoice.issuedOn} />
                  <Row
                    label={translate('invoice.quantity')}
                    value={`${invoice.quantity} × ${money(invoice.unitPriceOriginal)}`}
                  />
                  <Row
                    label={translate('invoice.paymentSource')}
                    value={translate(`invoice.sources.${invoice.paymentSource}`)}
                  />
                  <Row
                    label={translate('invoice.linkedTo')}
                    value={
                      invoice.requestId && onOpenRequest ? (
                        <FinanceButton variant='ghost' onClick={() => onOpenRequest(invoice.requestId as string)}>
                          {translate('invoice.openRequest')}
                        </FinanceButton>
                      ) : (
                        translate(`invoice.linkKinds.${invoice.linkKind}`)
                      )
                    }
                  />
                  <Row
                    label={translate('invoice.chargedTo')}
                    value={
                      chargedCostCenter
                        ? `${chargedCostCenter.code} · ${chargedCostCenter.name}`
                        : invoice.chargedCostCenterId
                          ? translate('invoice.chargedCostCenter')
                          : translate(`invoice.chargedNone.${invoice.linkKind}`)
                    }
                  />
                  <Row label={translate('invoice.submittedAt')} value={dateTime(invoice.submittedAt)} />
                  {invoice.decidedAt && (
                    <Row label={translate('invoice.decidedAt')} value={dateTime(invoice.decidedAt)} />
                  )}
                  {invoice.state === 'CONFIRMED' && (
                    <Row
                      label={translate('invoice.booked')}
                      value={invoice.invoiceId ? translate('invoice.bookedYes') : translate('invoice.bookedNo')}
                    />
                  )}
                  {invoice.returnReason && (
                    <Row label={translate('invoice.returnReason')} value={invoice.returnReason} />
                  )}
                  {invoice.resubmissionOfId && onOpenInvoice && (
                    <Row
                      label={translate('invoice.resubmissionOf')}
                      value={
                        <FinanceButton
                          variant='ghost'
                          onClick={() => onOpenInvoice(invoice.resubmissionOfId as string)}
                        >
                          {translate('invoice.openInvoice')}
                        </FinanceButton>
                      }
                    />
                  )}
                  {invoice.resubmittedAsId && onOpenInvoice && (
                    <Row
                      label={translate('invoice.resubmittedAs')}
                      value={
                        <FinanceButton variant='ghost' onClick={() => onOpenInvoice(invoice.resubmittedAsId as string)}>
                          {translate('invoice.openInvoice')}
                        </FinanceButton>
                      }
                    />
                  )}
                </dl>
              </FinanceSection>
              <FinanceSection title={translate('invoice.documents')}>
                <ul className='flex flex-wrap gap-2'>
                  {invoice.documents.map((document, index) => (
                    <li key={document.documentId}>
                      <FinanceButton
                        pending={link.isPending && link.variables === document.documentId}
                        onClick={() => link.mutate(document.documentId)}
                      >
                        <FileText aria-hidden className='size-4' strokeWidth={1.5} />
                        {translate('openFile')} {index + 1}
                      </FinanceButton>
                    </li>
                  ))}
                </ul>
              </FinanceSection>
            </>
          )}
        </FinanceQueryState>
        {signing && invoice && (
          <SignDialog
            id={id}
            number={invoice.vendorInvoiceNumber}
            spend={money(invoiceSpend(invoice.netAmount, invoice.nonDeductibleTax))}
            month={invoice.servicePeriodMonth}
            exception={invoice.matchResult === 'PRICE_QUANTITY_EXCEPTION'}
            onClose={() => setSigning(false)}
          />
        )}
        {returning && invoice && (
          <ReturnDialog id={id} number={invoice.vendorInvoiceNumber} onClose={() => setReturning(false)} />
        )}
      </FinancePage>
    </FinanceDetailPage>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='flex min-w-0 items-center justify-between gap-4 border-b border-border/40 pb-2'>
      <dt className='shrink-0 text-muted-foreground'>{label}</dt>
      <dd className='min-w-0 text-right font-medium break-words'>{value}</dd>
    </div>
  )
}

/** Signing books the spend and cannot be undone, so it asks first and says what will be written. */
function SignDialog({
  id,
  number,
  spend,
  month,
  exception,
  onClose
}: {
  id: string
  number: string
  spend: string
  month: string
  exception: boolean
  onClose: () => void
}) {
  const { t: translate } = useTranslation('financePurchases')
  const feedback = usePurchasesFeedback([getPurchaseInvoiceGetQueryKey(id), getPurchaseInvoiceListQueryKey()], onClose)
  const confirm = usePurchaseInvoiceConfirm({ mutation: feedback })
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (confirm.isPending) return
    confirm.mutate({ id })
  }
  return (
    <AdminFormDialog
      title={translate('invoice.signTitle', { number })}
      pending={confirm.isPending}
      submitLabel={translate('invoice.signSubmit')}
      onClose={onClose}
      onSubmit={submit}
    >
      <p className='text-sm'>{translate('invoice.signBody', { spend, month })}</p>
      {exception && (
        <p role='status' className='text-sm text-warning-ink'>
          {translate('invoice.exceptionWarning')}
        </p>
      )}
    </AdminFormDialog>
  )
}

function ReturnDialog({ id, number, onClose }: { id: string; number: string; onClose: () => void }) {
  const { t: translate } = useTranslation('financePurchases')
  const [reason, setReason] = useState('')
  const feedback = usePurchasesFeedback([getPurchaseInvoiceGetQueryKey(id), getPurchaseInvoiceListQueryKey()], onClose)
  const returned = usePurchaseInvoiceReturn({ mutation: feedback })
  const valid = Boolean(reason.trim())
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || returned.isPending) return
    returned.mutate({ id, data: { reason: reason.trim() } })
  }
  return (
    <AdminFormDialog
      title={translate('invoice.returnTitle', { number })}
      pending={returned.isPending}
      submitLabel={translate('invoice.returnSubmit')}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <FinanceField required label={translate('reason')} hint={translate('invoice.returnReasonHint')}>
        <textarea
          required
          rows={3}
          maxLength={1000}
          placeholder={translate('ui.returnReasonPlaceholder')}
          className={`${financeInputClass} max-h-48 min-h-24 resize-y`}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </FinanceField>
    </AdminFormDialog>
  )
}
