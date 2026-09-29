import { ArrowRight, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { teamSoftware } from '../team-software-demo'

export function SoftwareCharts({ onReviewGhost }: { onReviewGhost: () => void }) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const percent = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent', maximumFractionDigits: 0 })
  const licenses = [
    { label: t('teamSoftware.inUse'), value: 28, color: 'bg-brand-500' },
    { label: t('teamSoftware.available'), value: 3, color: 'bg-brand-100' },
    { label: t('teamSoftware.expiringWindow'), value: 2, color: 'bg-brand-600' },
    { label: t('teamSoftware.expired'), value: 0, color: 'bg-danger' }
  ]
  const health = [
    { label: t('teamSoftware.health.high'), value: 5, color: 'bg-brand-500' },
    { label: t('teamSoftware.health.medium'), value: 2, color: 'bg-brand-200' },
    { label: t('teamSoftware.health.low'), value: 1, color: 'bg-brand-100' },
    { label: t('teamSoftware.health.ghost'), value: 3, color: 'bg-danger' }
  ]
  const card = 'rounded-xl border border-neutral-200 bg-white p-5 shadow-sm'
  return (
    <div className='grid gap-6 xl:grid-cols-3'>
      <section className={card}>
        <h2 className='mb-6 text-sm font-bold'>{t('teamSoftware.licenseOverview')}</h2>
        <div className='flex flex-wrap items-center gap-4'>
          <div
            aria-hidden='true'
            className='flex size-30 shrink-0 items-center justify-center rounded-full'
            style={{ background: 'conic-gradient(var(--color-brand-500) 0% 90%, var(--color-brand-100) 90% 100%)' }}
          >
            <div className='flex size-22 flex-col items-center justify-center rounded-full bg-white'>
              <p className='text-2xl font-bold'>{number.format(31)}</p>
              <p className='mt-1 text-[10px] text-neutral-500'>{t('teamSoftware.total')}</p>
            </div>
          </div>
          <dl className='min-w-36 flex-1 space-y-3 text-xs'>
            {licenses.map(({ label, value, color }) => (
              <div key={label} className='flex items-start justify-between gap-2'>
                <dt className='flex items-start gap-2 text-neutral-500'>
                  <span aria-hidden='true' className={`mt-0.5 size-2.5 shrink-0 rounded-full ${color}`} />
                  {label}
                </dt>
                <dd className='shrink-0 font-medium'>
                  {t('teamSoftware.legendValue', { value: number.format(value), percent: percent.format(value / 31) })}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className={`${card} flex flex-col`}>
        <h2 className='mb-6 text-sm font-bold'>{t('teamSoftware.usageHealth')}</h2>
        <div className='mb-6 flex flex-wrap items-center gap-4'>
          <div
            aria-hidden='true'
            className='flex size-30 shrink-0 items-center justify-center rounded-full'
            style={{
              background:
                'conic-gradient(var(--color-brand-500) 0% 50%, var(--color-brand-200) 50% 70%, var(--color-brand-100) 70% 80%, var(--color-danger) 80% 100%)'
            }}
          >
            <div className='size-20 rounded-full bg-white' />
          </div>
          <dl className='min-w-36 flex-1 space-y-3 text-xs'>
            {health.map(({ label, value, color }) => (
              <div key={label} className='flex justify-between gap-2'>
                <dt className='flex items-start gap-2 text-neutral-500'>
                  <span aria-hidden='true' className={`mt-0.5 size-2.5 shrink-0 rounded-full ${color}`} />
                  {label}
                </dt>
                <dd className='font-medium'>{number.format(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className='mt-auto flex flex-wrap items-center gap-3 rounded-lg border border-brand-200 bg-brand-100 p-3'>
          <Info size={16} aria-hidden='true' className='shrink-0 text-brand-600' />
          <div className='min-w-0 flex-1'>
            <p className='text-xs font-medium text-neutral-900'>
              {t('teamSoftware.ghostDetected', { value: number.format(3) })}
            </p>
            <p className='mt-1 text-xs text-brand-600'>{t('teamSoftware.ghostHint')}</p>
          </div>
          <button
            type='button'
            onClick={onReviewGhost}
            className='rounded-md border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100'
          >
            {t('teamSoftware.reviewGhost')}
          </button>
        </div>
      </section>
      <section className={`${card} flex flex-col`}>
        <h2 className='mb-4 text-sm font-bold'>{t('teamSoftware.topUsage')}</h2>
        <ul className='flex-1 space-y-3'>
          {teamSoftware.map((item) => (
            <li key={item.id} className='flex items-center gap-3 text-xs'>
              <span className='w-24 shrink-0 truncate font-medium text-neutral-500' title={item.name}>
                {item.name}
              </span>
              <div aria-hidden='true' className='h-1.5 flex-1 overflow-hidden rounded bg-neutral-200'>
                <div
                  style={{ width: `${item.usage * 100}%` }}
                  className={`h-full rounded ${item.usage >= 0.8 ? 'bg-brand-500' : item.usage < 0.5 ? 'bg-brand-100' : 'bg-brand-200'}`}
                />
              </div>
              <span className='w-8 text-right font-medium text-neutral-500'>{percent.format(item.usage)}</span>
            </li>
          ))}
        </ul>
        <a
          href='#team-software-table'
          className='mt-4 flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline'
        >
          {t('teamSoftware.viewAll')}
          <ArrowRight size={12} aria-hidden='true' />
        </a>
      </section>
    </div>
  )
}
