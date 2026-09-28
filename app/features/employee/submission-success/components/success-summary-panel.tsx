import { ArrowRight, Building2, Calendar, ExternalLink, FileText, Folder, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { SuccessSummaryData } from '../submission-success.types'

interface SuccessSummaryPanelProps {
  requestId?: string
  requestType?: string
  summary?: Partial<SuccessSummaryData>
}

export function SuccessSummaryPanel({
  requestId = 'REQ-1027',
  requestType = 'new-software',
  summary
}: SuccessSummaryPanelProps) {
  const { t } = useTranslation()

  const getRequestTypeName = () => {
    if (summary?.requestType) return summary.requestType
    if (requestType === 'temporary-renewal') return t('reviewRequest.types.temporaryRenewal')
    if (requestType === 'return-license') return t('reviewRequest.types.returnLicense')
    return t('reviewRequest.types.newSoftware')
  }

  const getPeriodDisplay = () => {
    if (summary?.requestedPeriod) {
      return {
        period: summary.requestedPeriod,
        duration: summary.periodDuration
      }
    }
    if (requestType === 'temporary-renewal') {
      return {
        period: t('reviewRequest.details.newExpirationValue'),
        duration: t('submissionSuccess.summary.periodDays', { count: 92 })
      }
    }
    if (requestType === 'return-license') {
      return {
        period: t('reviewRequest.details.expirationDateValue'),
        duration: ''
      }
    }
    return {
      period: t('reviewRequest.details.requiredUntilValue'),
      duration: t('submissionSuccess.summary.periodDays', { count: 214 })
    }
  }

  const periodInfo = getPeriodDisplay()

  return (
    <div className='border-t border-neutral-200 p-6 sm:p-8'>
      <h3 className='mb-6 text-lg font-bold text-neutral-900'>{t('submissionSuccess.summary.title')}</h3>

      {/* Row 1: Software info, Request Type, Requested Period */}
      <div className='mb-8 grid grid-cols-1 gap-x-6 gap-y-8 border-b border-neutral-200 pb-8 md:grid-cols-3'>
        {/* Software Info */}
        <div className='col-span-1 flex items-center gap-4'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-[#FEFBF7] p-2'>
            <svg className='h-7 w-7' viewBox='0 0 38 57' xmlns='http://www.w3.org/2000/svg'>
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
          <div>
            <h4 className='text-lg font-bold text-neutral-900'>{t('submissionSuccess.summary.softwareName')}</h4>
            <p className='mt-0.5 text-sm text-neutral-500'>{t('submissionSuccess.summary.planName')}</p>
          </div>
        </div>

        {/* Request Type */}
        <div className='col-span-1'>
          <div className='mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase'>
            <FileText className='h-4 w-4' />
            {t('submissionSuccess.summary.requestTypeLabel')}
          </div>
          <p className='font-medium text-neutral-900'>{getRequestTypeName()}</p>
        </div>

        {/* Requested Period */}
        <div className='col-span-1'>
          <div className='mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase'>
            <Calendar className='h-4 w-4' />
            {t('submissionSuccess.summary.requestedPeriodLabel')}
          </div>
          <p className='font-medium text-neutral-900'>{periodInfo.period}</p>
          {periodInfo.duration ? <p className='mt-0.5 text-sm text-neutral-500'>{periodInfo.duration}</p> : null}
        </div>
      </div>

      {/* Row 2: Additional details (Project, Cost Center, Requested By) */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='flex items-start gap-3'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-[#FEFBF7] text-neutral-500'>
            <Folder className='h-4 w-4' />
          </div>
          <div>
            <p className='mb-1 text-xs font-medium text-neutral-500'>{t('submissionSuccess.summary.projectLabel')}</p>
            <p className='text-sm font-medium text-neutral-900'>
              {summary?.project || t('submissionSuccess.summary.defaultProject')}
            </p>
          </div>
        </div>

        <div className='flex items-start gap-3'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-[#FEFBF7] text-neutral-500'>
            <Building2 className='h-4 w-4' />
          </div>
          <div>
            <p className='mb-1 text-xs font-medium text-neutral-500'>
              {t('submissionSuccess.summary.costCenterLabel')}
            </p>
            <p className='text-sm font-medium text-neutral-900'>
              {summary?.costCenter || t('submissionSuccess.summary.defaultCostCenter')}
            </p>
          </div>
        </div>

        <div className='flex items-start gap-3'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-[#FEFBF7] text-neutral-500'>
            <User className='h-4 w-4' />
          </div>
          <div>
            <p className='mb-1 text-xs font-medium text-neutral-500'>
              {t('submissionSuccess.summary.requestedByLabel')}
            </p>
            <p className='text-sm font-medium text-neutral-900'>
              {summary?.requestedBy || t('submissionSuccess.summary.defaultRequestedBy')}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:justify-between'>
        <Link
          className='flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-brand-500 transition-colors hover:bg-brand-50'
          to={`/employee/my-requests/${requestId}`}
        >
          <ExternalLink className='h-4 w-4' />
          {t('submissionSuccess.actions.viewDetails')}
        </Link>

        <Link
          className='flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-600'
          to='/employee/dashboard'
        >
          {t('submissionSuccess.actions.backDashboard')}
          <ArrowRight className='h-4 w-4' />
        </Link>
      </div>
    </div>
  )
}
