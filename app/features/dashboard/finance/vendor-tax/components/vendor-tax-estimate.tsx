import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useVendorTaxEstimate } from '~/shared/api/generated/operations/vendors'
import { useCurrencyList } from '~/shared/api/generated/operations/currencies'
import { FinanceButton, FinanceField, FinanceQueryState, financeInputClass } from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { formatMoney, isDecimal } from '../../shared/finance-money'

export function VendorTaxEstimate({ vendorId }: { vendorId: string }) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const [netAmount, setNetAmount] = useState('')
  const [currency, setCurrency] = useState('')
  const [params, setParams] = useState<{ netAmount: string; currency: string } | null>(null)
  const currencies = useCurrencyList()
  const estimate = useVendorTaxEstimate(vendorId, params ?? { netAmount: '0', currency: '' }, {
    query: { enabled: !!params }
  })
  const result = estimate.data?.data
  const valid = isDecimal(netAmount) && !!currencies.data?.data?.items.some((item) => item.code === currency)
  return (
    <section className='space-y-4'>
      <h3 className='font-semibold'>{translate('estimate')}</h3>
      <p className='text-sm text-muted-foreground'>{translate('estimateHint')}</p>
      <form
        className='grid gap-4 sm:grid-cols-2'
        onSubmit={(event) => {
          event.preventDefault()
          if (valid && !estimate.isFetching) setParams({ netAmount, currency })
        }}
      >
        <FinanceField label={translate('netAmount')}>
          <input
            className={financeInputClass}
            required
            inputMode='decimal'
            value={netAmount}
            onChange={(event) => setNetAmount(event.target.value)}
          />
        </FinanceField>
        <FinanceQueryState query={currencies}>
          <FinanceField label={translate('currency')}>
            <select
              className={financeInputClass}
              required
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              <option value=''>{translate('chooseCurrency')}</option>
              {currencies.data?.data?.items.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code}
                </option>
              ))}
            </select>
          </FinanceField>
        </FinanceQueryState>
        <FinanceButton type='submit' pending={estimate.isFetching} disabled={!valid}>
          {translate('estimate')}
        </FinanceButton>
      </form>
      {params && (
        <FinanceQueryState query={estimate}>
          {result && (
            <>
              <dl className='grid gap-3 sm:grid-cols-2'>
                {(
                  ['netAmount', 'taxAmount', 'deductibleTaxAmount', 'nonDeductibleTaxAmount', 'estimatedCost'] as const
                ).map((field) => (
                  <div key={field}>
                    <dt className='text-sm text-muted-foreground'>{translate(field)}</dt>
                    <dd className='font-mono tabular-nums'>
                      {formatMoney({ amount: result[field], currency: result.currency }, i18n.language)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className='text-sm'>
                {translate('basis')}: {translate(`enum.${result.basis}`, { defaultValue: translate('unavailable') })} ·{' '}
                {translate('label')}: {translate(`enum.${result.label}`, { defaultValue: translate('unavailable') })} ·{' '}
                {translate('taxGroup')}: {translate(`enum.${result.group}`, { defaultValue: translate('unavailable') })}
              </p>
              <FinanceTable
                items={result.lines}
                rowKey={(line) => `${line.taxType}-${line.ratePercent}-${line.payer}`}
                columns={[
                  { key: 'type', label: translate('taxType'), render: (line) => line.taxType },
                  { key: 'rate', label: translate('ratePercent'), numeric: true, render: (line) => line.ratePercent },
                  {
                    key: 'deductible',
                    label: translate('deductible'),
                    render: (line) => translate(line.deductible ? 'yes' : 'no')
                  },
                  {
                    key: 'payer',
                    label: translate('payer'),
                    render: (line) => translate(`enum.${line.payer}`, { defaultValue: translate('unavailable') })
                  },
                  {
                    key: 'amount',
                    label: translate('taxAmount'),
                    numeric: true,
                    render: (line) => formatMoney({ amount: line.taxAmount, currency: result.currency }, i18n.language)
                  }
                ]}
              />
            </>
          )}
        </FinanceQueryState>
      )}
    </section>
  )
}
