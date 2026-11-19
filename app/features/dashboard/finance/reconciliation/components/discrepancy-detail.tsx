import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { InvoiceDiscrepancyClosureBodyDtoOutcome } from '~/shared/api/generated/model/invoice-discrepancies'
import {
  getInvoiceDiscrepancyGetQueryKey,
  getInvoiceDiscrepancyListQueryKey,
  useInvoiceDiscrepancyClose,
  useInvoiceDiscrepancyGet
} from '~/shared/api/generated/operations/invoice-discrepancies'
import { AdminFormDialog } from '~/shared/ui/form-dialog'
import { MoneyInput } from '~/shared/ui/money-input'
import {
  FinanceButton,
  FinanceDetailPage,
  FinanceField,
  FinancePage,
  FinanceQueryState,
  FinanceSection,
  FinanceSelect,
  FinanceStatus,
  financeInputClass
} from '../../shared/components/finance-ui'
import { formatMoney, isDecimal } from '../../shared/finance-money'
import { usePurchasesFeedback } from '../../purchase-invoices/hooks/use-purchases-feedback'

type Outcome = (typeof InvoiceDiscrepancyClosureBodyDtoOutcome)[keyof typeof InvoiceDiscrepancyClosureBodyDtoOutcome]

export function DiscrepancyDetail({
  id,
  onBack,
  onOpenInvoice
}: {
  id: string
  onBack: () => void
  onOpenInvoice?: (invoiceId: string) => void
}) {
  const { t: translate, i18n } = useTranslation('financePurchases')
  const query = useInvoiceDiscrepancyGet(id)
  const item = query.data?.data
  const [closing, setClosing] = useState(false)
  const unknown = translate('discrepancy.unknown')
  const dateTime = (value: string) => new Date(value).toLocaleString(i18n.language)
  return (
    <FinanceDetailPage>
      <FinancePage
        title={translate('discrepancy.detailTitle', { number: item?.purchaseInvoice.vendorInvoiceNumber ?? '' })}
        actions={
          <>
            <FinanceButton variant='ghost' onClick={onBack}>
              {translate('back')}
            </FinanceButton>
            {item && onOpenInvoice && (
              <FinanceButton onClick={() => onOpenInvoice(item.purchaseInvoice.id)}>
                {translate('discrepancy.openInvoice')}
              </FinanceButton>
            )}
            {item?.state === 'OPEN' && (
              <FinanceButton variant='primary' onClick={() => setClosing(true)}>
                {translate('discrepancy.close')}
              </FinanceButton>
            )}
          </>
        }
      >
        <FinanceQueryState query={query} skeleton='detail'>
          {item && (
            <>
              <div className='flex flex-wrap items-center gap-3'>
                <FinanceStatus value={item.state} label={translate(`discrepancy.states.${item.state}`)} />
                {item.outcome && <span className='text-sm'>{translate(`discrepancy.outcomes.${item.outcome}`)}</span>}
                {item.outcome === 'OUT_OF_PROCESS_SUSPECTED' && (
                  <span className='text-xs text-muted-foreground'>{translate('discrepancy.suspectedNote')}</span>
                )}
              </div>
              <FinanceSection title={translate('ui.comparison')}>
                <div className='overflow-x-auto rounded-xl border border-border/70 bg-surface shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]'>
                  <table className='w-full text-sm'>
                    <thead className='border-b border-border/70 bg-surface-subtle/60 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase'>
                      <tr>
                        <th scope='col' className='px-3 py-2 text-left' />
                        <th scope='col' className='px-3 py-2 text-right'>
                          {translate('discrepancy.onInvoice')}
                        </th>
                        <th scope='col' className='px-3 py-2 text-right'>
                          {translate(
                            item.purchaseInvoice.linkKind === 'REQUEST'
                              ? 'discrepancy.expectedRequest'
                              : 'discrepancy.expectedSubscription'
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border/40'>
                      <tr className={item.mismatches.includes('QUANTITY') ? 'bg-warning/10' : undefined}>
                        <th scope='row' className='px-3 py-2 text-left font-medium'>
                          {translate('discrepancy.quantityRow')}
                        </th>
                        <td className='px-3 py-2 text-right font-mono tabular-nums'>{item.quantity.invoice}</td>
                        <td className='px-3 py-2 text-right font-mono tabular-nums'>
                          {item.quantity.expected ?? unknown}
                        </td>
                      </tr>
                      <tr className={item.mismatches.includes('UNIT_PRICE') ? 'bg-warning/10' : undefined}>
                        <th scope='row' className='px-3 py-2 text-left font-medium'>
                          {translate('discrepancy.unitPriceRow')}
                        </th>
                        <td className='px-3 py-2 text-right font-mono tabular-nums'>
                          {formatMoney(item.unitPrice.invoice, i18n.language)}
                        </td>
                        <td className='px-3 py-2 text-right font-mono tabular-nums'>
                          {item.unitPrice.expected ? formatMoney(item.unitPrice.expected, i18n.language) : unknown}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className='text-xs text-muted-foreground'>{translate('discrepancy.vndNote')}</p>
              </FinanceSection>
              <FinanceSection title={translate('ui.caseInfo')}>
                <dl className='grid gap-x-8 gap-y-3 rounded-xl border border-border/70 bg-surface p-4 text-sm sm:grid-cols-2 sm:p-5'>
                  <Row
                    label={translate('discrepancy.mismatches')}
                    value={item.mismatches
                      .map((mismatch) => translate(`discrepancy.mismatchNames.${mismatch}`))
                      .join(', ')}
                  />
                  <Row
                    label={translate('invoice.netAmount')}
                    value={formatMoney(item.purchaseInvoice.netAmount, i18n.language)}
                  />
                  <Row
                    label={translate('invoice.servicePeriodMonth')}
                    value={item.purchaseInvoice.servicePeriodMonth}
                  />
                  <Row label={translate('discrepancy.openedAt')} value={dateTime(item.openedAt)} />
                  {item.closure && (
                    <>
                      <Row label={translate('reason')} value={item.closure.reason} />
                      <Row
                        label={translate('discrepancy.differenceAmount')}
                        value={formatMoney(item.closure.differenceAmount, i18n.language)}
                      />
                      <Row label={translate('discrepancy.closedAt')} value={dateTime(item.closure.closedAt)} />
                    </>
                  )}
                </dl>
              </FinanceSection>
            </>
          )}
        </FinanceQueryState>
        {closing && <CloseDialog id={id} onClose={() => setClosing(false)} />}
      </FinancePage>
    </FinanceDetailPage>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex min-w-0 justify-between gap-4 border-b border-border/40 pb-2'>
      <dt className='shrink-0 text-muted-foreground'>{label}</dt>
      <dd className='min-w-0 text-right font-medium break-words'>{value}</dd>
    </div>
  )
}

function CloseDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const { t: translate } = useTranslation('financePurchases')
  const [outcome, setOutcome] = useState<Outcome>(InvoiceDiscrepancyClosureBodyDtoOutcome.EXPLAINED)
  const [reason, setReason] = useState('')
  const [difference, setDifference] = useState('0')
  const feedback = usePurchasesFeedback(
    [getInvoiceDiscrepancyGetQueryKey(id), getInvoiceDiscrepancyListQueryKey()],
    onClose
  )
  const close = useInvoiceDiscrepancyClose({ mutation: feedback })
  const differenceValid =
    isDecimal(difference) &&
    (outcome === InvoiceDiscrepancyClosureBodyDtoOutcome.EXPLAINED ? Number(difference) >= 0 : Number(difference) > 0)
  const valid = Boolean(reason.trim()) && differenceValid
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid || close.isPending) return
    close.mutate({ id, data: { outcome, reason: reason.trim(), differenceAmount: { amount: difference } } })
  }
  return (
    <AdminFormDialog
      title={translate('discrepancy.closeTitle')}
      pending={close.isPending}
      submitLabel={translate('discrepancy.closeSubmit')}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <FinanceField
        label={translate('discrepancy.closeOutcome')}
        hint={translate(`discrepancy.outcomeHints.${outcome}`)}
      >
        <FinanceSelect
          placeholder={translate('ui.outcomePlaceholder')}
          value={outcome}
          onChange={(event) =>
            setOutcome(
              Object.values(InvoiceDiscrepancyClosureBodyDtoOutcome).find((value) => value === event.target.value) ??
                InvoiceDiscrepancyClosureBodyDtoOutcome.EXPLAINED
            )
          }
        >
          {Object.values(InvoiceDiscrepancyClosureBodyDtoOutcome).map((value) => (
            <option key={value} value={value}>
              {translate(`discrepancy.outcomes.${value}`)}
            </option>
          ))}
        </FinanceSelect>
      </FinanceField>
      <FinanceField
        required
        label={translate('discrepancy.differenceAmount')}
        hint={translate('discrepancy.differenceHint')}
        error={difference && !differenceValid ? translate('errors.differenceInvalid') : null}
      >
        <MoneyInput
          maxLength={40}
          placeholder={translate('ui.differencePlaceholder')}
          aria-invalid={Boolean(difference) && !differenceValid}
          className={`${financeInputClass} font-mono tabular-nums`}
          value={difference}
          onValueChange={setDifference}
        />
      </FinanceField>
      <FinanceField required label={translate('reason')} hint={translate('discrepancy.reasonHint')}>
        <textarea
          required
          rows={3}
          maxLength={1000}
          placeholder={translate('ui.discrepancyReasonPlaceholder')}
          className={`${financeInputClass} max-h-48 min-h-24 resize-y`}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </FinanceField>
    </AdminFormDialog>
  )
}
