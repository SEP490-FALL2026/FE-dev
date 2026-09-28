import { Building2, Calendar, Clock, Folder, Info, Tag, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { RenewalSummaryData } from '../temporary-renewal.types'

interface RenewalSummaryPanelProps {
  data: RenewalSummaryData
}

export function RenewalSummaryPanel({ data }: RenewalSummaryPanelProps) {
  const { t } = useTranslation()

  return (
    <div className='sticky top-24 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h3 className='mb-4 text-lg font-bold text-neutral-900'>{t('temporaryRenewal.summary.title')}</h3>

      {/* App Info Card */}
      <div className='mb-6 flex items-center justify-between rounded-lg border border-neutral-200 bg-brand-50/50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white p-1 shadow-2xs'>
            <div className='h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-rose-500' />
          </div>
          <div>
            <h4 className='font-bold text-neutral-900'>{data.softwareName}</h4>
            <p className='text-xs text-neutral-500'>{data.planName}</p>
          </div>
        </div>
        <span className='rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-status-active'>
          {t('temporaryRenewal.summary.statusActive')}
        </span>
      </div>

      {/* Summary Details */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <Calendar className='h-4 w-4' />
            <span className='text-sm'>{t('temporaryRenewal.summary.currentExpiration')}</span>
          </div>
          <span className='text-sm font-semibold text-brand-600'>{data.currentExpiration}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <Calendar className='h-4 w-4' />
            <span className='text-sm'>{t('temporaryRenewal.summary.newExpiration')}</span>
          </div>
          <span className='text-sm font-semibold text-status-active'>{data.newExpiration}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <Clock className='h-4 w-4' />
            <span className='text-sm'>{t('temporaryRenewal.summary.extensionDuration')}</span>
          </div>
          <span className='text-sm font-semibold text-neutral-900'>{data.duration}</span>
        </div>

        <div className='my-2 h-px w-full bg-neutral-200' />

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <Folder className='h-4 w-4' />
            <span className='text-sm'>{t('temporaryRenewal.summary.project')}</span>
          </div>
          <span className='text-sm font-medium text-neutral-900'>{data.project}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <Building2 className='h-4 w-4' />
            <span className='text-sm'>{t('temporaryRenewal.summary.costCenter')}</span>
          </div>
          <span className='text-sm font-medium text-neutral-900'>{data.costCenter}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <User className='h-4 w-4' />
            <span className='text-sm'>{t('temporaryRenewal.summary.requestedBy')}</span>
          </div>
          <span className='text-sm font-medium text-neutral-900'>{data.requestedBy}</span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <Tag className='h-4 w-4' />
            <span className='text-sm'>{t('temporaryRenewal.summary.requestType')}</span>
          </div>
          <span className='text-sm font-medium text-neutral-900'>{t('temporaryRenewal.summary.requestTypeValue')}</span>
        </div>
      </div>

      {/* Info Box */}
      <div className='mt-8 rounded-lg border border-brand-300 bg-amber-50/70 p-4'>
        <div className='mb-2 flex items-start gap-2.5'>
          <Info className='mt-0.5 h-4 w-4 shrink-0 text-brand-500' />
          <h4 className='text-sm font-semibold text-neutral-900'>{t('temporaryRenewal.summary.noticeTitle')}</h4>
        </div>
        <p className='pl-6.5 text-xs text-neutral-600 leading-relaxed'>
          {t('temporaryRenewal.summary.noticeDescription')}
        </p>
      </div>
    </div>
  )
}
