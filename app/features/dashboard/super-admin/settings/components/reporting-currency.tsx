import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrencyList } from '~/shared/api/generated/operations/currencies/currency-list'
import {
  getReportingCurrencyGetQueryKey,
  useReportingCurrencyGet
} from '~/shared/api/generated/operations/operating-parameters/reporting-currency-get'
import { useReportingCurrencySet } from '~/shared/api/generated/operations/operating-parameters/reporting-currency-set'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AdminField, AdminFormDialog, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { useAdminMutationFeedback } from '../../shared/hooks/use-admin-mutation-feedback'

export function ReportingCurrency() {
  const { t: translate } = useTranslation('admin')
  const query = useReportingCurrencyGet()
  const currencies = useCurrencyList()
  const [editing, setEditing] = useState(false)
  const [currency, setCurrency] = useState('')
  const feedback = useAdminMutationFeedback([getReportingCurrencyGetQueryKey()], () => setEditing(false))
  const mutation = useReportingCurrencySet({ mutation: feedback })
  const items = currencies.data?.data?.items ?? []
  const valid = items.some((item) => item.code === currency)
  return (
    <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
      <h2 className='font-semibold'>{translate('settings.currency')}</h2>
      <AdminQueryState query={query}>
        <div className='flex items-center justify-between gap-3'>
          <span className='font-mono'>{query.data?.data?.currency ?? translate('none')}</span>
          <button
            type='button'
            className={adminButtonClass}
            onClick={() => {
              setCurrency(query.data?.data?.currency ?? '')
              setEditing(true)
            }}
          >
            {translate('edit')}
          </button>
        </div>
      </AdminQueryState>
      {editing && (
        <AdminFormDialog
          title={translate('settings.currencySave')}
          onClose={() => setEditing(false)}
          pending={mutation.isPending}
          submitDisabled={!valid || currencies.isError || currencies.isPending}
          onSubmit={(event) => {
            event.preventDefault()
            if (valid) mutation.mutate({ data: { currency } })
          }}
        >
          <p className='text-sm text-muted-foreground'>{translate('settings.currencyImpact')}</p>
          <AdminQueryState query={currencies}>
            <AdminField label={translate('settings.currency')}>
              <input
                required
                list='admin-currencies'
                pattern='[A-Z]{3}'
                className={adminInputClass}
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              />
              <datalist id='admin-currencies'>
                {items.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </datalist>
            </AdminField>
          </AdminQueryState>
          {!valid && <p className='text-xs text-danger'>{translate('errors.validation')}</p>}
        </AdminFormDialog>
      )}
    </section>
  )
}
