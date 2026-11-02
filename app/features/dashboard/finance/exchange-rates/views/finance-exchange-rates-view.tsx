import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useExchangeRateList,
  useExchangeRateRecord,
  getExchangeRateListQueryKey
} from '~/shared/api/generated/operations/exchange-rates'
import { useCurrencyList } from '~/shared/api/generated/operations/currencies'
import { AdminFormDialog as FinanceFormDialog } from '~/shared/ui/form-dialog'
import {
  FinanceButton,
  FinanceField,
  FinancePage,
  FinancePagination,
  FinanceQueryState,
  financeInputClass
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { useFinanceFeedback } from '../../shared/hooks/use-finance-feedback'
import { useFinanceRetry } from '../../shared/hooks/use-finance-retry'
import { isDecimal } from '../../shared/finance-money'
import { ExchangeRateSource } from '../enums/exchange-rate-source'

export function FinanceExchangeRatesView() {
  const { t: translate } = useTranslation('financeSettings')
  const [currency, setCurrency] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [create, setCreate] = useState(false)
  const currencies = useCurrencyList()
  const rates = useExchangeRateList({
    currency: currency || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    pageSize: 20
  })
  return (
    <FinancePage
      title={translate('exchangeRates')}
      actions={
        <FinanceButton variant='primary' onClick={() => setCreate(true)}>
          {translate('recordRate')}
        </FinanceButton>
      }
    >
      <div className='flex flex-wrap items-end gap-4'>
        <FinanceQueryState query={currencies}>
          <FinanceField label={translate('currency')}>
            <select
              className={financeInputClass}
              value={currency}
              onChange={(event) => {
                setCurrency(event.target.value)
                setPage(1)
              }}
            >
              <option value=''>{translate('all')}</option>
              {currencies.data?.data?.items.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} · {item.name}
                </option>
              ))}
            </select>
          </FinanceField>
        </FinanceQueryState>
        <FinanceField label={translate('from')}>
          <input
            className={financeInputClass}
            type='date'
            value={from}
            max={to || undefined}
            onChange={(event) => {
              setFrom(event.target.value)
              setPage(1)
            }}
          />
        </FinanceField>
        <FinanceField label={translate('to')}>
          <input
            className={financeInputClass}
            type='date'
            value={to}
            min={from || undefined}
            onChange={(event) => {
              setTo(event.target.value)
              setPage(1)
            }}
          />
        </FinanceField>
      </div>
      <FinanceQueryState query={rates}>
        <FinanceTable
          items={rates.data?.data?.items ?? []}
          rowKey={(item) => item.id}
          columns={[
            { key: 'currency', label: translate('currency'), render: (item) => item.currency },
            { key: 'date', label: translate('rateDate'), numeric: true, render: (item) => item.rateDate },
            { key: 'rate', label: translate('rate'), numeric: true, render: (item) => item.rate },
            {
              key: 'reportingCurrency',
              label: translate('reportingCurrency'),
              render: (item) => item.reportingCurrency
            },
            {
              key: 'source',
              label: translate('source'),
              render: (item) =>
                item.source === ExchangeRateSource.MANUAL ? translate('enum.MANUAL') : translate('unavailable')
            }
          ]}
        />
        <FinancePagination pagination={rates.data?.data?.pagination} onPageChange={setPage} />
      </FinanceQueryState>
      {create && <ExchangeRateForm onClose={() => setCreate(false)} />}
    </FinancePage>
  )
}

function ExchangeRateForm({ onClose }: { onClose: () => void }) {
  const { t: translate } = useTranslation('financeSettings')
  const [currency, setCurrency] = useState('')
  const [date, setDate] = useState('')
  const [rate, setRate] = useState('')
  const currencies = useCurrencyList()
  const feedback = useFinanceFeedback([getExchangeRateListQueryKey()], onClose)
  const record = useExchangeRateRecord({ mutation: feedback })
  const retrySeconds = useFinanceRetry()
  const valid =
    isDecimal(rate) &&
    /[1-9]/.test(rate) &&
    rate.length <= 40 &&
    !!date &&
    !!currencies.data?.data?.items.some((item) => item.code === currency)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (record.isPending || !valid || retrySeconds > 0) return
    record.mutate({ data: { currency, rateDate: date, rate } })
  }
  return (
    <FinanceFormDialog
      title={translate('recordRate')}
      onClose={onClose}
      onSubmit={submit}
      pending={record.isPending}
      submitDisabled={!valid || retrySeconds > 0}
      submitLabel={translate('save')}
    >
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
                {item.code} · {item.name}
              </option>
            ))}
          </select>
        </FinanceField>
      </FinanceQueryState>
      <FinanceField label={translate('rateDate')}>
        <input
          className={financeInputClass}
          required
          type='date'
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </FinanceField>
      <FinanceField label={translate('rate')} hint={translate('rateHint')}>
        <input
          className={financeInputClass}
          required
          inputMode='decimal'
          maxLength={40}
          value={rate}
          onChange={(event) => setRate(event.target.value)}
        />
      </FinanceField>
    </FinanceFormDialog>
  )
}
