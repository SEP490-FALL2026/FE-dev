import { useState } from 'react'
import { MoneyInput } from '~/shared/ui/money-input'
import { useTranslation } from 'react-i18next'
import { Calculator } from 'lucide-react'
import { useVendorTaxEstimate } from '~/shared/api/generated/operations/vendors'
import { useCurrencyList } from '~/shared/api/generated/operations/currencies'
import {
  FinanceButton,
  FinanceField,
  FinanceQueryState,
  FinanceSection,
  FinanceSelect,
  FinanceStat,
  FinanceStatGrid,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable, type FinanceColumn } from '../../shared/components/finance-table'
import { formatMoney, isDecimal } from '../../shared/finance-money'
import { taxLineKey, useTaxLineColumns, type TaxLine } from './tax-line-columns'

const resultFields = [
  'netAmount',
  'taxAmount',
  'deductibleTaxAmount',
  'nonDeductibleTaxAmount',
  'estimatedCost'
] as const

export function VendorTaxEstimate({ vendorId }: { vendorId: string }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const [netAmount, setNetAmount] = useState('')
  const [currency, setCurrency] = useState('')
  const [params, setParams] = useState<{ netAmount: string; currency: string } | null>(null)
  const currencies = useCurrencyList()
  const lineColumns = useTaxLineColumns()
  const estimate = useVendorTaxEstimate(vendorId, params ?? { netAmount: '0', currency: '' }, {
    query: { enabled: !!params }
  })
  const result = estimate.data?.data
  const validAmount = isDecimal(netAmount)
  const valid = validAmount && !!currencies.data?.data?.items.some((item) => item.code === currency)
  const amountError = netAmount && !validAmount ? translate('amountInvalid') : null
  const enumLabel = (value: string) => translate(`enum.${value}`, { defaultValue: translate('unavailable') })
  const columns: FinanceColumn<TaxLine & { taxAmount: string }>[] = [
    ...lineColumns,
    {
      key: 'amount',
      label: translate('taxAmount'),
      numeric: true,
      render: (line) =>
        result ? formatMoney({ amount: line.taxAmount, currency: result.currency }, i18n.language) : '—'
    }
  ]
  return (
    <FinanceSection title={translate('estimate')}>
      <p className='-mt-1 text-sm text-muted-foreground text-pretty'>{translate('estimateHint')}</p>
      <form
        className='space-y-3'
        onSubmit={(event) => {
          event.preventDefault()
          if (valid && !estimate.isFetching) setParams({ netAmount, currency })
        }}
      >
        <div className='grid gap-4 sm:grid-cols-2'>
          <FinanceField label={translate('netAmount')} required error={amountError}>
            <MoneyInput
              className={`${financeInputClass} text-right font-mono tabular-nums`}
              required
              placeholder={translate('netAmountPlaceholder')}
              aria-invalid={!!amountError}
              value={netAmount}
              onValueChange={setNetAmount}
            />
          </FinanceField>
          <FinanceQueryState query={currencies}>
            <FinanceField label={translate('currency')} required>
              <FinanceSelect required value={currency} onChange={(event) => setCurrency(event.target.value)}>
                <option value=''>{translate('chooseCurrency')}</option>
                {currencies.data?.data?.items.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code}
                  </option>
                ))}
              </FinanceSelect>
            </FinanceField>
          </FinanceQueryState>
        </div>
        <FinanceButton type='submit' pending={estimate.isFetching} disabled={!valid}>
          <Calculator aria-hidden className='size-4' strokeWidth={1.5} />
          {translate('estimate')}
        </FinanceButton>
      </form>
      {params && (
        <FinanceQueryState query={estimate}>
          {result && (
            <div className='space-y-4'>
              <FinanceStatGrid>
                {resultFields.map((field) => (
                  <FinanceStat
                    key={field}
                    label={translate(field)}
                    emphasis={field === 'estimatedCost'}
                    value={formatMoney({ amount: result[field], currency: result.currency }, i18n.language)}
                  />
                ))}
              </FinanceStatGrid>
              <p className='text-sm text-muted-foreground'>
                {translate('basis')}: <span className='text-foreground'>{enumLabel(result.basis)}</span> ·{' '}
                {translate('label')}: <span className='text-foreground'>{enumLabel(result.label)}</span> ·{' '}
                {translate('taxGroup')}: <span className='text-foreground'>{enumLabel(result.group)}</span>
              </p>
              <FinanceTable items={result.lines} rowKey={taxLineKey} columns={columns} />
            </div>
          )}
        </FinanceQueryState>
      )}
    </FinanceSection>
  )
}
