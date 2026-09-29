import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { useDocumentTitle } from '~/shared/lib/use-document-title'

import { DashboardDetails } from './components/dashboard-details'
import { DateRangeFilter } from './components/date-range-filter'
import { MetricCards } from './components/metric-cards'
import { RequestStatus } from './components/request-status'
import { UsageChart } from './components/usage-chart'

function validDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function ManagerDashboardPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  useDocumentTitle(t('manager.documentTitle'))
  const from = params.get('start')
  const to = params.get('end')
  const valid = validDate(from) && validDate(to) && from <= to
  const start = valid ? from : '2025-04-21'
  const end = valid ? to : '2025-05-20'
  return (
    <>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{t('manager.title')}</h1>
          <p className='mt-1 text-sm text-neutral-500'>{t('manager.subtitle')}</p>
        </div>
        <DateRangeFilter start={start} end={end} />
      </div>
      <MetricCards />
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-12'>
        <div className='min-w-0 xl:col-span-7'>
          <UsageChart />
        </div>
        <div className='min-w-0 xl:col-span-5'>
          <RequestStatus />
        </div>
      </div>
      <DashboardDetails start={start} end={end} />
      <p className='text-xs text-neutral-500'>{t('manager.demo')}</p>
    </>
  )
}
