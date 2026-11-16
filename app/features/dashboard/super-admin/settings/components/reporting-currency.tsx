import { useTranslation } from 'react-i18next'
import { useReportingCurrencyGet } from '~/shared/api/generated/operations/operating-parameters/reporting-currency-get'
import { AdminQueryState } from '../../shared/components/admin-query-state'

export function ReportingCurrency() {
  const { t: translate } = useTranslation('admin')
  const query = useReportingCurrencyGet()
  return (
    <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
      <div className='space-y-1'>
        <h2 className='font-semibold'>{translate('settings.currency')}</h2>
        <p className='text-xs text-muted-foreground'>{translate('settings.currencyReadOnly')}</p>
      </div>
      <AdminQueryState query={query}>
        <div className='flex items-center justify-between gap-3'>
          <span className='font-mono font-semibold tabular-nums text-foreground'>
            {query.data?.data?.currency ?? 'VND'}
          </span>
        </div>
      </AdminQueryState>
    </section>
  )
}
