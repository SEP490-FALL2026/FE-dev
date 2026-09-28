import { AlertCircle, Building2, Calendar, CalendarX, FolderOpen, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { ReturnSoftwareDetail } from '../return-license.types'

interface ReturnSummaryPanelProps {
  software: ReturnSoftwareDetail
}

export function ReturnSummaryPanel({ software }: ReturnSummaryPanelProps) {
  const { t } = useTranslation()

  return (
    <div className='sticky top-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h3 className='mb-6 text-lg font-bold text-neutral-900'>{t('returnLicense.summary.title')}</h3>

      {/* Software Header */}
      <div className='mb-6 flex items-start justify-between gap-3 border-b border-neutral-200 pb-6'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FEFBF7] p-1.5 shadow-2xs'>
            <svg className='h-6 w-6 shrink-0' fill='none' viewBox='0 0 38 57'>
              <path
                d='M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z'
                fill='#1ABCFE'
              />
              <path
                d='M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z'
                fill='#0ACF83'
              />
              <path d='M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z' fill='#FF7262' />
              <path d='M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z' fill='#F24E1E' />
              <path d='M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z' fill='#A259FF' />
            </svg>
          </div>
          <div className='min-w-0'>
            <h4 className='truncate text-sm font-bold text-neutral-900'>{software.name}</h4>
            <p className='truncate text-xs text-neutral-500'>{software.plan}</p>
          </div>
        </div>
        <span className='shrink-0 rounded bg-[#E7F7F0] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-status-active uppercase'>
          {t('returnLicense.summary.statusActive')}
        </span>
      </div>

      {/* Summary Details List */}
      <div className='mb-6 space-y-4 border-b border-neutral-200 pb-6'>
        <div className='flex items-center justify-between gap-3 text-sm'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <Calendar className='h-4 w-4 shrink-0 text-brand-400' />
            <span>{t('returnLicense.summary.assignedDate')}</span>
          </div>
          <span className='font-medium text-neutral-900'>{software.assignedDate}</span>
        </div>

        <div className='flex items-center justify-between gap-3 text-sm'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <CalendarX className='h-4 w-4 shrink-0 text-brand-400' />
            <span>{t('returnLicense.summary.expirationDate')}</span>
          </div>
          <span className='font-medium text-neutral-900'>{software.expirationDate}</span>
        </div>

        <div className='flex items-center justify-between gap-3 text-sm'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <FolderOpen className='h-4 w-4 shrink-0 text-brand-400' />
            <span>{t('returnLicense.summary.project')}</span>
          </div>
          <span className='font-medium text-neutral-900'>{software.project}</span>
        </div>

        <div className='flex items-center justify-between gap-3 text-sm'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <Building2 className='h-4 w-4 shrink-0 text-brand-400' />
            <span>{t('returnLicense.summary.costCenter')}</span>
          </div>
          <span className='font-medium text-neutral-900'>{software.costCenter}</span>
        </div>

        <div className='flex items-center justify-between gap-3 text-sm'>
          <div className='flex items-center gap-2 text-neutral-500'>
            <User className='h-4 w-4 shrink-0 text-brand-400' />
            <span>{t('returnLicense.summary.requestedBy')}</span>
          </div>
          <span className='text-right font-medium text-neutral-900'>{software.requestedBy}</span>
        </div>
      </div>

      {/* Request Type */}
      <div className='mb-6 flex items-center justify-between gap-3'>
        <span className='text-sm text-neutral-500'>{t('returnLicense.summary.requestType')}</span>
        <span className='inline-flex shrink-0 items-center rounded-md border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600'>
          {t('returnLicense.summary.requestTypeValue')}
        </span>
      </div>

      {/* Important Info Alert */}
      <div className='rounded-lg border border-brand-200 bg-[#FFF8F0] p-4'>
        <div className='flex gap-3'>
          <AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-brand-500' />
          <div>
            <h5 className='mb-1 text-sm font-semibold text-neutral-900'>{t('returnLicense.summary.noticeTitle')}</h5>
            <p className='text-xs leading-relaxed text-neutral-600'>
              {t('returnLicense.summary.noticeLine1')}
              <br />
              {t('returnLicense.summary.noticeLine2')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
