import { ArrowLeft, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { AccessAuditLogCard } from './components/access-audit-log-card'
import { DataClassificationTableCard } from './components/data-classification-table-card'
import { DataUsageMetricsGrid } from './components/data-usage-metrics-grid'
import { MonitoredAppsCard } from './components/monitored-apps-card'
import { PrivacyGuaranteesCard } from './components/privacy-guarantees-card'
import { RelatedControlsCard } from './components/related-controls-card'

export function DataUsagePage() {
  const { t } = useTranslation()

  return (
    <div className='mx-auto max-w-[1360px] pb-12'>
      {/* Back Navigation Link */}
      <Link
        className='mb-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600'
        to='/employee/profile#data-privacy'
      >
        <ArrowLeft className='h-4 w-4' />
        {t('dataUsage.header.backLink')}
      </Link>

      {/* Page Header & Compliance Badge */}
      <div className='mb-8 flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-neutral-900'>{t('dataUsage.header.title')}</h1>
          <p className='mt-1.5 text-sm text-neutral-500'>{t('dataUsage.header.subtitle')}</p>
        </div>
        <div className='flex shrink-0 items-center gap-3'>
          <div className='flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-600 shadow-xs'>
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
            <span>{t('dataUsage.header.pdpBadge')}</span>
          </div>
          <button
            className='flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-900 shadow-xs transition hover:bg-[#FEFBF7]'
            type='button'
          >
            <Download className='h-4 w-4 text-brand-500' />
            {t('dataUsage.header.exportUsageLog')}
          </button>
        </div>
      </div>

      {/* Top Metric Overview Cards */}
      <div className='mb-8'>
        <DataUsageMetricsGrid />
      </div>

      {/* Main Two Column Layout */}
      <div className='grid grid-cols-12 gap-8'>
        {/* Left 2 Columns: Application Usage & Data Category Specs */}
        <div className='col-span-8 space-y-8'>
          <MonitoredAppsCard />
          <DataClassificationTableCard />
        </div>

        {/* Right 1 Column: Access Log Transparency & User Controls */}
        <div className='col-span-4 space-y-8'>
          <AccessAuditLogCard />
          <PrivacyGuaranteesCard />
          <RelatedControlsCard />
        </div>
      </div>
    </div>
  )
}
