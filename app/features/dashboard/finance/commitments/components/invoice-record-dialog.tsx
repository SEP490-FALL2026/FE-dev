import { AlertCircle, CheckCircle2, DollarSign, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { getFinanceError } from '../../shared/finance-errors'
import { formatMoney } from '../../shared/finance-money'
import { useRecordInvoice } from '../hooks/use-finance-commitments'
import type { ExtendedCommitmentItem, InvoiceRecordedResponseDto } from '../../shared/finance-api-extensions'

export function InvoiceRecordDialog({
  commitment,
  onClose
}: {
  commitment: ExtendedCommitmentItem
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const { t: translateFinance } = useTranslation('finance')

  const [number, setNumber] = useState('')
  const [issuedOn, setIssuedOn] = useState(new Date().toISOString().split('T')[0])
  const [netAmount, setNetAmount] = useState('')
  const [deductibleTax, setDeductibleTax] = useState('')
  const [nonDeductibleTax, setNonDeductibleTax] = useState('')
  const [note, setNote] = useState('')
  const [outcome, setOutcome] = useState<InvoiceRecordedResponseDto['data'] | null>(null)

  const mutation = useRecordInvoice(commitment.id)

  const currency = commitment.amount.currency
  const netNum = Number(netAmount) || 0
  const deductibleNum = Number(deductibleTax) || 0
  const nonDeductibleNum = Number(nonDeductibleTax) || 0
  const actualCostNum = netNum + nonDeductibleNum
  const heldNum = Number(commitment.held.amount) || 0

  const willExceed = netNum > heldNum

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!number.trim() || !issuedOn || netNum <= 0) return

    mutation.mutate(
      {
        number: number.trim(),
        issuedOn,
        netAmount: { amount: String(netNum) },
        ...(deductibleNum > 0 ? { deductibleTax: { amount: String(deductibleNum) } } : {}),
        ...(nonDeductibleNum > 0 ? { nonDeductibleTax: { amount: String(nonDeductibleNum) } } : {}),
        ...(note.trim() ? { note: note.trim() } : {})
      },
      {
        onSuccess: (res) => {
          setOutcome(res.data)
          const result = res.data.invoice.matchResult
          if (result === 'MATCHED') {
            toast.success(translateFinance('invoices.matchedToast'))
          } else if (result === 'TAX_ONLY') {
            toast.info(translateFinance('invoices.taxOnlyToast'))
          } else {
            toast.warning(translateFinance('invoices.exceptionToast'))
          }
        },
        onError: (error: unknown) => {
          const failure = getFinanceError(error)
          toast.error(translateFinance(`errors.${failure.ambiguous ? 'ambiguous' : failure.key}`), {
            id: 'finance-invoice'
          })
        }
      }
    )
  }

  if (outcome) {
    const inv = outcome.invoice
    return (
      <FinanceFormDialog
        title={translateFinance('recordInvoice')}
        pending={false}
        onClose={onClose}
        submitLabel={translateFinance('close')}
        onSubmit={(e) => {
          e.preventDefault()
          onClose()
        }}
      >
        <div className='space-y-4'>
          <div className='rounded-lg border border-border/70 bg-surface-subtle/50 p-4'>
            <div className='flex items-center gap-2 font-semibold text-foreground'>
              {inv.matchResult === 'PRICE_QUANTITY_EXCEPTION' ? (
                <AlertCircle className='size-5 text-warning-ink' />
              ) : (
                <CheckCircle2 className='size-5 text-success-ink' />
              )}
              <span>{translateFinance(`matchResults.${inv.matchResult}`)}</span>
            </div>
            <p className='mt-2 text-xs text-muted-foreground'>
              {inv.matchResult === 'PRICE_QUANTITY_EXCEPTION'
                ? translateFinance('invoices.exceptionDesc', {
                    defaultValue: 'Đơn giá hoặc số tiền vượt số đã duyệt. Hệ thống mở hồ sơ sai lệch, hóa đơn vẫn được tính vào thực chi.'
                  })
                : inv.matchResult === 'TAX_ONLY'
                  ? translateFinance('invoices.taxOnlyDesc', {
                      defaultValue: 'Hóa đơn có thuế phát sinh. Phần thuế được tách riêng, chi phí thực tính theo chi phí thực chịu.'
                    })
                  : translateFinance('invoices.matchedDesc', {
                      defaultValue: 'Hóa đơn hoàn toàn khớp với cam kết đã duyệt.'
                    })}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3 text-xs'>
            <div>
              <span className='text-muted-foreground'>{translateFinance('invoiceNumber')}:</span>{' '}
              <span className='font-mono font-medium'>{inv.number}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>{translateFinance('actualCost')}:</span>{' '}
              <span className='font-mono font-bold text-foreground'>
                {formatMoney(inv.actualCost, i18n.language)}
              </span>
            </div>
          </div>
        </div>
      </FinanceFormDialog>
    )
  }

  return (
    <FinanceFormDialog
      title={translateFinance('recordInvoice')}
      pending={mutation.isPending}
      onClose={onClose}
      submitLabel={translateFinance('recordInvoice')}
      submitDisabled={!number.trim() || !issuedOn || netNum <= 0}
      onSubmit={handleSubmit}
    >
      <div className='space-y-4'>
        {/* Tóm tắt cam kết đang chọn */}
        <div className='rounded-lg border border-border/70 bg-surface-subtle/40 p-3 text-xs space-y-1.5'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{translate('department')}:</span>
            <span className='font-medium text-foreground'>{commitment.costCenter.name}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{translate('application')}:</span>
            <span className='font-medium text-foreground'>
              {commitment.request?.software.name ?? translate('application')}
              {commitment.request?.plan?.name ? ` (${commitment.request.plan.name})` : ''}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{translateFinance('held')}:</span>
            <span className='font-mono font-bold text-warning-ink'>
              {formatMoney(commitment.held, i18n.language)}
            </span>
          </div>
        </div>

        {/* Form nhập hóa đơn */}
        <div className='grid grid-cols-2 gap-3'>
          <FinanceField label={translateFinance('invoiceNumber')} required>
            <input
              type='text'
              maxLength={64}
              required
              className={financeInputClass}
              placeholder='INV-2026-001'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </FinanceField>

          <FinanceField label={translateFinance('issuedOn')} required>
            <input
              type='date'
              required
              className={financeInputClass}
              value={issuedOn}
              onChange={(e) => setIssuedOn(e.target.value)}
            />
          </FinanceField>
        </div>

        <FinanceField label={`${translateFinance('netAmount')} (${currency})`} required>
          <input
            type='number'
            step='any'
            min='1'
            required
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder='10000000'
            value={netAmount}
            onChange={(e) => setNetAmount(e.target.value)}
          />
        </FinanceField>

        <div className='grid grid-cols-2 gap-3'>
          <FinanceField label={`${translateFinance('deductibleTax')} (${currency})`}>
            <input
              type='number'
              step='any'
              min='0'
              className={`${financeInputClass} font-mono tabular-nums`}
              placeholder='0'
              value={deductibleTax}
              onChange={(e) => setDeductibleTax(e.target.value)}
            />
          </FinanceField>

          <FinanceField label={`${translateFinance('nonDeductibleTax')} (${currency})`}>
            <input
              type='number'
              step='any'
              min='0'
              className={`${financeInputClass} font-mono tabular-nums`}
              placeholder='0'
              value={nonDeductibleTax}
              onChange={(e) => setNonDeductibleTax(e.target.value)}
            />
          </FinanceField>
        </div>

        <FinanceField label={translateFinance('invoiceNote')}>
          <input
            type='text'
            maxLength={1000}
            className={financeInputClass}
            placeholder={translateFinance('invoiceNote')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </FinanceField>

        {/* Khối tính toán Preview */}
        {netNum > 0 && (
          <div className='rounded-lg border border-border/70 bg-primary/5 p-3 text-xs space-y-1.5'>
            <div className='flex items-center justify-between font-medium'>
              <span className='flex items-center gap-1 text-primary'>
                <DollarSign className='size-3.5' />
                {translateFinance('invoices.actualCostPreview')}
              </span>
              <span className='font-mono font-bold text-foreground'>
                {formatMoney({ amount: String(actualCostNum), currency }, i18n.language)}
              </span>
            </div>
            {deductibleNum > 0 && (
              <div className='flex items-center justify-between text-muted-foreground'>
                <span>{translateFinance('invoices.deductibleSeparate')}</span>
                <span className='font-mono'>{formatMoney({ amount: String(deductibleNum), currency }, i18n.language)}</span>
              </div>
            )}
            {willExceed && (
              <div className='flex items-center gap-1.5 pt-1 text-warning-ink font-medium'>
                <Info className='size-3.5 shrink-0' />
                <span>
                  {translateFinance('invoices.exceedPreviewNotice', {
                    defaultValue: 'Số tiền trước thuế vượt phần cam kết còn giữ. Hệ thống sẽ ghi nhận ngoại lệ giá/số lượng.'
                  })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </FinanceFormDialog>
  )
}
