import { useTranslation } from 'react-i18next'
import { NonWorkingDates } from '../components/non-working-dates'
import { ReportingCurrency } from '../components/reporting-currency'

export function SuperAdminSettingsView() {
  const { t: translate } = useTranslation('admin')
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('settings.title')}</h1>
      <ReportingCurrency />
      <NonWorkingDates />
    </div>
  )
}
