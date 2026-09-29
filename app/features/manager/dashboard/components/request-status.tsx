import { Clock, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { statuses } from '../dashboard-demo'
import { DashboardPanel } from './dashboard-panel'

export function RequestStatus() {
  const { t, i18n } = useTranslation()
  const total = statuses.reduce((sum, item) => sum + item.count, 0)
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const percent = new Intl.NumberFormat(i18n.resolvedLanguage, { style: 'percent', maximumFractionDigits: 0 })
  return (
    <DashboardPanel
      title={t('manager.statusTitle')}
      icon={RefreshCw}
      action='viewAll'
      details={
        <ul className='space-y-2'>
          {statuses.map((item) => (
            <li key={item.key} className='flex justify-between'>
              <span>{t(`manager.${item.key}`)}</span>
              <span>{number.format(item.count)}</span>
            </li>
          ))}
        </ul>
      }
    >
      <div className='flex flex-col items-center justify-around gap-6 py-6 sm:flex-row'>
        <div className='relative size-40 shrink-0'>
          <svg viewBox='0 0 100 100' className='size-full -rotate-90' aria-hidden='true'>
            {statuses.map((item, index) => {
              const start = (statuses.slice(0, index).reduce((sum, status) => sum + status.count, 0) / total) * 100
              return (
                <circle
                  key={item.key}
                  cx='50'
                  cy='50'
                  r='38'
                  fill='none'
                  stroke={item.color}
                  strokeWidth='12'
                  pathLength='100'
                  strokeDasharray={`${(item.count / total) * 100} 100`}
                  strokeDashoffset={-start}
                />
              )
            })}
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <span className='text-2xl leading-none font-bold'>{number.format(total)}</span>
            <span className='mt-1 text-[11px] text-neutral-500'>{t('manager.totalRequests')}</span>
          </div>
        </div>
        <ul className='w-full space-y-3 text-xs'>
          {statuses.map((item) => (
            <li key={item.key} className='flex items-center justify-between gap-2'>
              <span className='flex items-center gap-2 text-neutral-500'>
                <span className='size-2.5 shrink-0 rounded-full' style={{ background: item.color }} />
                {t(`manager.${item.key}`)}
              </span>
              <span className='flex items-center gap-3'>
                <span className='font-semibold'>{number.format(item.count)}</span>
                <span className='w-8 text-right text-neutral-500'>{percent.format(item.count / total)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-brand-bg p-3'>
        <div className='flex items-center gap-2.5'>
          <span className='rounded-lg border border-neutral-200 bg-white p-1.5 text-brand-500'>
            <Clock size={16} aria-hidden='true' />
          </span>
          <div>
            <p className='text-[11px] text-neutral-500'>{t('manager.processingTime')}</p>
            <p className='text-xs font-bold'>{t('manager.hours', { value: number.format(2.4) })}</p>
          </div>
        </div>
        <p className='text-xs'>
          <span className='font-semibold text-success'>↓ {percent.format(0.35)}</span>{' '}
          <span className='text-[11px] text-neutral-500'>{t('manager.previousMonth')}</span>
        </p>
      </div>
    </DashboardPanel>
  )
}
