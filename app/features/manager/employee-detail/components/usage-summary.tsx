import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { assignedSoftware } from '~/entities/license/employee-assignments-demo'
import { SoftwareLogo } from './software-logo'

export function UsageSummary({ onUsage, full = false }: { onUsage?: () => void; full?: boolean }) {
  const { t, i18n } = useTranslation()
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' })
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  return (
    <section className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='flex items-center gap-2 text-base font-semibold'>
            {t('employeeDetail.usage')}
            <span title={t('employeeDetail.usageUnavailable')}>
              <Info size={14} className='text-neutral-500' aria-hidden='true' />
            </span>
          </h2>
          <p className='text-xs text-neutral-500'>{t('employeeDetail.usageSubtitle')}</p>
        </div>
        {!full && (
          <button type='button' onClick={onUsage} className='text-sm font-medium text-brand-600 hover:underline'>
            {t('employeeDetail.usageReport')}
          </button>
        )}
      </div>
      <div className='grid grid-cols-1 gap-4 border-t border-neutral-200 pt-4 sm:grid-cols-2 xl:grid-cols-4'>
        {[
          { app: assignedSoftware[0], title: 'mostActive', count: 26, last: t('employeeDetail.sampleToday') },
          {
            app: assignedSoftware[3],
            title: 'leastActive',
            count: 8,
            last: date.format(new Date('2026-05-11T00:00:00Z'))
          }
        ].map(({ app, title, count, last }) => (
          <div key={title}>
            <p className='mb-2 text-xs text-neutral-500'>{t(`employeeDetail.${title}`)}</p>
            <div className='mb-1 flex items-center gap-2'>
              <SoftwareLogo name={app.name} url={app.logo} />
              <p className='text-sm font-medium'>{app.name}</p>
            </div>
            <p className='text-sm font-semibold'>{t('employeeDetail.days', { count })}</p>
            <p className='mt-1 text-xs text-neutral-500'>{t('employeeDetail.lastActive', { date: last })}</p>
          </div>
        ))}
        <div>
          <p className='mb-2 text-xs text-neutral-500'>{t('employeeDetail.inactive60')}</p>
          <p className='mt-3 mb-1 text-2xl font-bold'>{number.format(0)}</p>
          <p className='text-xs text-neutral-500'>{t('employeeDetail.noLicenses')}</p>
        </div>
        <div>
          <p className='mb-2 text-xs text-neutral-500'>{t('employeeDetail.coverage')}</p>
          <p className='mt-3 mb-1 text-2xl font-bold'>
            {new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent' }).format(1)}
          </p>
          <p className='text-xs text-neutral-500'>{t('employeeDetail.allActive')}</p>
        </div>
      </div>
      {full && <p className='mt-4 text-xs text-neutral-500'>{t('employeeDetail.usageUnavailable')}</p>}
    </section>
  )
}
