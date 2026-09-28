import { Activity, ExternalLink, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function UsageMonitoringCard() {
  const { t } = useTranslation()

  return (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs'>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-500'>
            <Activity className='h-4 w-4' />
          </div>
          <h2 className='text-base font-bold text-neutral-900'>{t('softwareDetail.usageMonitoring.title')}</h2>
        </div>
        <span className='rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-status-active'>
          {t('softwareDetail.usageMonitoring.enabled')}
        </span>
      </div>

      {/* Warm Tinted Notice Box */}
      <div className='mb-5 flex items-start gap-3 rounded-xl border border-brand-200/60 bg-brand-50/50 p-3.5'>
        <Info className='mt-0.5 h-4 w-4 shrink-0 text-brand-500' />
        <p className='text-xs leading-relaxed text-neutral-600'>{t('softwareDetail.usageMonitoring.notice')}</p>
      </div>

      {/* Details List */}
      <div className='space-y-4 text-xs'>
        <div>
          <span className='mb-1.5 block font-semibold text-neutral-900'>
            {t('softwareDetail.usageMonitoring.dataCollectedTitle')}
          </span>
          <ul className='list-inside list-disc space-y-1 text-neutral-500'>
            <li>{t('softwareDetail.usageMonitoring.lastActivityDate')}</li>
            <li>{t('softwareDetail.usageMonitoring.usageSummary')}</li>
            <li>{t('softwareDetail.usageMonitoring.applicationEvents')}</li>
          </ul>
        </div>

        <div>
          <span className='mb-0.5 block font-semibold text-neutral-900'>
            {t('softwareDetail.usageMonitoring.dataSourceTitle')}
          </span>
          <p className='text-neutral-500'>{t('softwareDetail.usageMonitoring.dataSourceValue')}</p>
        </div>

        <div>
          <span className='mb-0.5 block font-semibold text-neutral-900'>
            {t('softwareDetail.usageMonitoring.purposeTitle')}
          </span>
          <p className='text-neutral-500'>{t('softwareDetail.usageMonitoring.purposeValue')}</p>
        </div>

        <div className='pt-1'>
          <a
            className='inline-flex items-center gap-1.5 font-semibold text-brand-500 transition-colors hover:text-brand-600'
            href='#policy'
          >
            <span>{t('softwareDetail.actions.viewDataPolicy')}</span>
            <ExternalLink className='h-3.5 w-3.5' />
          </a>
        </div>
      </div>
    </section>
  )
}
