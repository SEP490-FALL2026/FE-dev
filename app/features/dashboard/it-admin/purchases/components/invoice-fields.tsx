import { useTranslation } from 'react-i18next'
import { useCurrencyList } from '~/shared/api/generated/operations/currencies/currency-list'
import { MoneyInput } from '~/shared/ui/money-input'
import { ItField, itInputClass } from '../../shared/components/it-form'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { itMoneyPattern } from '../../shared/components/it-money-pattern'

export type InvoiceDraft = {
  number: string
  issuedOn: string
  month: string
  quantity: string
  unitPrice: string
  currency: string
  netAmount: string
  deductibleTax: string
  nonDeductibleTax: string
  paymentSource: 'COMPANY_CARD' | 'IT_ADVANCE'
}
export function InvoiceFields({
  draft,
  onChange,
  disabled
}: {
  draft: InvoiceDraft
  onChange: (key: keyof InvoiceDraft, value: string) => void
  disabled: boolean
}) {
  const { t: translate, i18n } = useTranslation('itInvoices')
  const { t: translatePlaceholder } = useTranslation('itPlaceholders')
  const currencies = useCurrencyList()
  return (
    <div className='grid gap-4 sm:grid-cols-2 [&>.it-form-field]:row-span-3 [&>.it-form-field]:grid-rows-subgrid'>
      {(
        [
          'number',
          'issuedOn',
          'month',
          'quantity',
          'unitPrice',
          'netAmount',
          'deductibleTax',
          'nonDeductibleTax'
        ] as const
      ).map((key) => {
        const required = key !== 'deductibleTax' && key !== 'nonDeductibleTax'
        if (key === 'unitPrice' || key === 'netAmount' || key === 'deductibleTax' || key === 'nonDeductibleTax') {
          return (
            <ItField key={key} label={translate(key)} hint={translate(`hints.${key}`)}>
              <MoneyInput
                placeholder={translatePlaceholder(`invoice.${key}`)}
                className={`${itInputClass} text-left font-mono tabular-nums`}
                inputMode={key === 'unitPrice' ? 'decimal' : 'numeric'}
                required={required}
                disabled={disabled}
                value={draft[key]}
                pattern={`(?=(?:[^0-9]*[0-9]){1,${key === 'unitPrice' ? 32 : 16}}[^0-9]*$)${itMoneyPattern(i18n.resolvedLanguage, key === 'unitPrice')}`}
                onValueChange={(value) => onChange(key, value)}
              />
            </ItField>
          )
        }
        const type = key === 'issuedOn' ? 'date' : key === 'month' ? 'month' : key === 'quantity' ? 'number' : 'text'
        return (
          <ItField key={key} label={translate(key)} hint={translate(`hints.${key}`)}>
            <input
              placeholder={translatePlaceholder(`invoice.${key}`)}
              className={itInputClass}
              type={type}
              required={required}
              disabled={disabled}
              value={draft[key]}
              min={key === 'quantity' ? 1 : undefined}
              max={key === 'quantity' ? 1000000 : undefined}
              step={key === 'quantity' ? 1 : undefined}
              maxLength={key === 'number' ? 64 : 32}
              onChange={(event) => onChange(key, event.target.value)}
            />
          </ItField>
        )
      })}
      <ItChoiceSelect
        label={translate('currency')}
        hint={translate('hints.currency')}
        required
        value={draft.currency}
        disabled={disabled}
        loading={currencies.isFetching}
        onChange={(value) => onChange('currency', value)}
        options={[
          { value: 'VND', label: translate('vnd') },
          ...(currencies.data?.data?.items ?? [])
            .filter((item) => item.code !== 'VND')
            .map((item) => ({ value: item.code, label: item.code }))
        ]}
      />
      <ItChoiceSelect
        label={translate('paymentSource')}
        hint={translate('hints.paymentSource')}
        required
        value={draft.paymentSource}
        disabled={disabled}
        onChange={(value) => onChange('paymentSource', value)}
        options={(['COMPANY_CARD', 'IT_ADVANCE'] as const).map((value) => ({
          value,
          label: translate(`sources.${value}`)
        }))}
      />
    </div>
  )
}
