import type { Dispatch, InputHTMLAttributes, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { FinanceField, financeInputClass } from '../../shared/components/finance-ui'
import { currencyDigits, type InvoiceDraft, type InvoiceField, type InvoiceFieldErrors } from '../invoice-form'

const amountInputClass = `${financeInputClass} text-right font-mono tabular-nums`

/** The invoice inputs shared by the commitment drawer and the invoice intake screen. */
export function InvoiceFields({
  currency,
  draft,
  setDraft,
  errors,
  setErrors
}: {
  currency: string
  draft: InvoiceDraft
  setDraft: Dispatch<SetStateAction<InvoiceDraft>>
  errors: InvoiceFieldErrors
  setErrors: Dispatch<SetStateAction<InvoiceFieldErrors>>
}) {
  const { t: translate } = useTranslation('financeSpend')
  const errorOf = (field: InvoiceField) => {
    const error = errors[field]
    return error
      ? translate(`commitments.record.errors.${error}`, { currency, digits: currencyDigits(currency) })
      : null
  }
  const change = (field: InvoiceField, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }
  const inputProps = (field: InvoiceField): InputHTMLAttributes<HTMLInputElement> => ({
    name: field,
    value: draft[field],
    'aria-invalid': Boolean(errors[field]),
    onChange: (event) => change(field, event.target.value)
  })
  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <FinanceField label={translate('commitments.invoices.number')} required error={errorOf('number')}>
          <input
            {...inputProps('number')}
            className={`${financeInputClass} font-mono`}
            maxLength={64}
            autoComplete='off'
            placeholder={translate('commitments.record.numberPlaceholder')}
          />
        </FinanceField>
        <FinanceField label={translate('commitments.invoices.issuedOn')} required error={errorOf('issuedOn')}>
          <input
            {...inputProps('issuedOn')}
            type='date'
            className={`${financeInputClass} font-mono tabular-nums`}
            placeholder={translate('commitments.record.issuedOnPlaceholder')}
          />
        </FinanceField>
      </div>
      <FinanceField
        label={translate('commitments.invoices.netAmount')}
        required
        error={errorOf('netAmount')}
        hint={translate('commitments.record.amountHint', { currency })}
      >
        <input
          {...inputProps('netAmount')}
          className={amountInputClass}
          inputMode='decimal'
          autoComplete='off'
          placeholder={translate('commitments.record.netAmountPlaceholder')}
        />
      </FinanceField>
      <div className='grid gap-4 sm:grid-cols-2'>
        <FinanceField
          label={translate('commitments.invoices.deductibleTax')}
          error={errorOf('deductibleTax')}
          hint={translate('commitments.record.deductibleTaxHint')}
        >
          <input
            {...inputProps('deductibleTax')}
            className={amountInputClass}
            inputMode='decimal'
            autoComplete='off'
            placeholder={translate('commitments.record.deductibleTaxPlaceholder')}
          />
        </FinanceField>
        <FinanceField
          label={translate('commitments.invoices.nonDeductibleTax')}
          error={errorOf('nonDeductibleTax')}
          hint={translate('commitments.record.nonDeductibleTaxHint')}
        >
          <input
            {...inputProps('nonDeductibleTax')}
            className={amountInputClass}
            inputMode='decimal'
            autoComplete='off'
            placeholder={translate('commitments.record.nonDeductibleTaxPlaceholder')}
          />
        </FinanceField>
      </div>
      <p className='text-xs text-muted-foreground'>{translate('commitments.record.actualCostHint')}</p>
      <FinanceField label={translate('commitments.invoices.note')} error={errorOf('note')}>
        <textarea
          name='note'
          rows={3}
          maxLength={1000}
          className={`${financeInputClass} resize-y`}
          placeholder={translate('commitments.record.notePlaceholder')}
          value={draft.note}
          aria-invalid={Boolean(errors.note)}
          onChange={(event) => change('note', event.target.value)}
        />
      </FinanceField>
    </div>
  )
}
