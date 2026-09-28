import { BarChart3, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareDetailData } from '../software-detail.types'

interface UsageStatusCardProps {
  data: SoftwareDetailData
}

export function UsageStatusCard({ data }: UsageStatusCardProps) {
  const { t } = useTranslation()

  const activePercent = data.usagePercentage
  const inactivePercent = 100 - activePercent

  return (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs'>
      {/* Header */}
      <div className='mb-5 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-500'>
            <BarChart3 className='h-4 w-4' />
          </div>
          <h2 className='text-base font-bold text-neutral-900'>{t('softwareDetail.usageStatus.title')}</h2>
        </div>
        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-status-active'>
          <span className='h-1.5 w-1.5 rounded-full bg-status-active' />
          {t('softwareDetail.usageStatus.healthy')}
        </span>
      </div>

      {/* Radial Gauge & Metrics Legend */}
      <div className='mb-5 flex items-center justify-around gap-4'>
        {/* Donut Chart Container */}
        <div
          className='relative flex h-28 w-28 items-center justify-center rounded-full'
          style={{
            background: `conic-gradient(#3DB87F 0% ${activePercent}%, #EDE7E2 ${activePercent}% 100%)`
          }}
        >
          {/* Inner cutout */}
          <div className='flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white p-1 text-center shadow-inner'>
            <span className='text-sm font-bold text-neutral-900'>{activePercent}%</span>
            <span className='text-[9px] font-medium leading-none text-neutral-500'>
              {t('softwareDetail.usageStatus.activeUsage')}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className='max-w-[140px] flex-1 space-y-3 text-xs'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-status-active' />
              <span className='text-neutral-500'>
                {t('softwareDetail.usageStatus.activeCount', { count: data.activeCount })}
              </span>
            </div>
            <span className='font-semibold text-neutral-900'>{activePercent}%</span>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <span className='h-2 w-2 rounded-full bg-neutral-200 ring-1 ring-neutral-400' />
              <span className='text-neutral-500'>
                {t('softwareDetail.usageStatus.inactiveCount', { count: data.inactiveCount })}
              </span>
            </div>
            <span className='font-semibold text-neutral-900'>{inactivePercent}%</span>
          </div>
        </div>
      </div>

      {/* Notice Footer */}
      <div className='flex items-center gap-2.5 rounded-xl border border-brand-200/60 bg-brand-50/50 p-3'>
        <Info className='h-4 w-4 shrink-0 text-brand-500' />
        <div className='text-[11px] text-neutral-500'>
          <span className='block font-medium text-neutral-900'>{t('softwareDetail.usageStatus.lastActivity')}</span>
          {t('softwareDetail.usageStatus.lastActivityValue')}
        </div>
      </div>
    </section>
  )
}
