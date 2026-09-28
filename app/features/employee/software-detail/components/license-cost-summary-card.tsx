import { ArrowRight, Calendar, DollarSign, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareDetailData } from '../software-detail.types'

interface LicenseCostSummaryCardProps {
  data: SoftwareDetailData
}

export function LicenseCostSummaryCard({ data }: LicenseCostSummaryCardProps) {
  const { t } = useTranslation()

  return (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-2'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-500'>
          <DollarSign className='h-4 w-4' />
        </div>
        <h2 className='text-base font-bold text-neutral-900'>{t('softwareDetail.licenseCostSummary.title')}</h2>
      </div>

      {/* Stats 3-column Box */}
      <div className='mb-5 grid grid-cols-3 border-b border-neutral-200 pb-5 text-center'>
        <div>
          <span className='block text-xs text-neutral-500'>{t('softwareDetail.licenseCostSummary.totalLicenses')}</span>
          <div className='mt-1 flex items-center justify-center gap-1.5'>
            <Users className='h-4 w-4 text-neutral-400' />
            <span className='text-lg font-bold text-neutral-900'>{data.totalLicenses}</span>
          </div>
        </div>

        <div>
          <span className='block text-xs text-neutral-500'>{t('softwareDetail.licenseCostSummary.assigned')}</span>
          <div className='mt-1 flex items-center justify-center gap-1'>
            <span className='h-2 w-2 rounded-full bg-status-active' />
            <span className='text-lg font-bold text-neutral-900'>{data.assignedLicenses}</span>
          </div>
        </div>

        <div>
          <span className='block text-xs text-neutral-500'>{t('softwareDetail.licenseCostSummary.available')}</span>
          <div className='mt-1 flex items-center justify-center gap-1'>
            <span className='h-2 w-2 rounded-full bg-neutral-200 ring-1 ring-neutral-400' />
            <span className='text-lg font-bold text-neutral-900'>{data.availableLicenses}</span>
          </div>
        </div>
      </div>

      {/* Cost Line Items */}
      <div className='mb-6 space-y-3.5'>
        <div className='flex items-center gap-3'>
          <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500'>
            <DollarSign className='h-4 w-4' />
          </div>
          <div>
            <span className='block text-xs text-neutral-500'>{t('softwareDetail.licenseCostSummary.monthlyCost')}</span>
            <span className='text-base font-bold text-neutral-900'>$ {data.monthlyCost.toFixed(2)}</span>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500'>
            <Calendar className='h-4 w-4' />
          </div>
          <div>
            <span className='block text-xs text-neutral-500'>
              {t('softwareDetail.licenseCostSummary.estimatedAnnualCost')}
            </span>
            <span className='text-base font-bold text-neutral-900'>
              $ {data.annualCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <a
        className='inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 transition-colors hover:text-brand-600'
        href='#cost-details'
      >
        <span>{t('softwareDetail.actions.viewCostDetails')}</span>
        <ArrowRight className='h-3.5 w-3.5' />
      </a>
    </section>
  )
}
