import { useTranslation } from 'react-i18next'
import { NonWorkingDates } from '../components/non-working-dates'
import { ReportingCurrency } from '../components/reporting-currency'
import { MonitoringNotice } from '../components/monitoring-notice'
import { useState } from 'react'

export function SuperAdminSettingsView() {
  const { t: translate } = useTranslation('admin')
  const [editingNotice, setEditingNotice] = useState(false)
  return (
    <div className='space-y-6'>
      {!editingNotice && (
        <>
          <h1 className='text-2xl font-semibold tracking-tight [text-wrap:balance]'>{translate('settings.title')}</h1>
          <ReportingCurrency />
          <NonWorkingDates />
        </>
      )}
      <MonitoringNotice onEditingChange={setEditingNotice} />
    </div>
  )
}
