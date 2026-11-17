import { useTranslation } from 'react-i18next'
import { useCurrencyList } from '~/shared/api/generated/operations/currencies/currency-list'
import { ItField, itInputClass } from '../../shared/components/it-form'

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
  const { t: translate } = useTranslation('itInvoices')
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
        const type = key === 'issuedOn' ? 'date' : key === 'month' ? 'month' : key === 'quantity' ? 'number' : 'text'
        return (
          <ItField key={key} label={translate(key)} hint={translate(`hints.${key}`)}>
            <input
              className={itInputClass}
              type={type}
              required={required}
              disabled={disabled}
              value={draft[key]}
              min={key === 'quantity' ? 1 : undefined}
              max={key === 'quantity' ? 1000000 : undefined}
              step={key === 'quantity' ? 1 : undefined}
              maxLength={key === 'number' ? 64 : 32}
              pattern={
                ['netAmount', 'deductibleTax', 'nonDeductibleTax'].includes(key)
                  ? '[0-9]{1,16}'
                  : key === 'unitPrice'
                    ? '[0-9]+([.][0-9]+)?'
                    : undefined
              }
              onChange={(event) => onChange(key, event.target.value)}
            />
          </ItField>
        )
      })}
      <ItField label={translate('currency')} hint={translate('hints.currency')}>
        <select
          required
          className={itInputClass}
          value={draft.currency}
          disabled={disabled}
          onChange={(event) => onChange('currency', event.target.value)}
        >
          <option value='VND'>{translate('vnd')}</option>
          {currencies.data?.data?.items
            .filter((item) => item.code !== 'VND')
            .map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
        </select>
      </ItField>
      <ItField label={translate('paymentSource')} hint={translate('hints.paymentSource')}>
        <select
          required
          className={itInputClass}
          value={draft.paymentSource}
          disabled={disabled}
          onChange={(event) => onChange('paymentSource', event.target.value)}
        >
          {(['COMPANY_CARD', 'IT_ADVANCE'] as const).map((value) => (
            <option key={value} value={value}>
              {translate(`sources.${value}`)}
            </option>
          ))}
        </select>
      </ItField>
    </div>
  )
}
