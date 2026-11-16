import { useTranslation } from 'react-i18next'
import { useReportingCurrencyGet } from '~/shared/api/generated/operations/operating-parameters/reporting-currency-get'
import { AdminQueryState } from '../../shared/components/admin-query-state'

/** The reporting currency is read-only: the API no longer offers an operation to change it. */
export function ReportingCurrency() {
  const { t: translate } = useTranslation('admin')
  const query = useReportingCurrencyGet()
  return (
    <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
      <h2 className='font-semibold'>{translate('settings.currency')}</h2>
      <AdminQueryState query={query}>
        <span className='font-mono'>{query.data?.data?.currency ?? translate('none')}</span>
      </AdminQueryState>
    </section>
  )
}
