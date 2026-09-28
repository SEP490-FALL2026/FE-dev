import { ArrowLeft, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import type { RequestDetailData } from '../request-detail.types'

interface RequestHeaderCardProps {
  data: RequestDetailData
}

export function RequestHeaderCard({ data }: RequestHeaderCardProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col justify-between gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs md:flex-row md:items-start'>
      <div className='flex gap-4'>
        <Link
          aria-label={t('requestDetail.backToRequests')}
          className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-brand-50 hover:text-neutral-900'
          to='/employee/my-requests'
        >
          <ArrowLeft className='h-4 w-4' />
        </Link>

        <div>
          <div className='mb-4 flex items-center gap-3'>
            <h1 className='text-2xl font-bold text-neutral-900'>{data.id}</h1>
            <span className='rounded-md border border-brand-200/50 bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700'>
              {t('myRequests.status.pending')}
            </span>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-1.5 shadow-xs'>
              <img alt={data.softwareName} className='h-8 w-8 object-contain' src={data.softwareLogoUrl} />
            </div>
            <div>
              <div className='flex items-center gap-3'>
                <h2 className='text-lg font-bold text-neutral-900'>{data.softwareName}</h2>
                <span className='rounded-full border border-brand-200/40 bg-brand-100/70 px-2.5 py-1 text-xs font-medium text-brand-700'>
                  {t(data.requestTypeBadge)}
                </span>
              </div>
              <p className='mt-1 text-sm text-neutral-600'>
                {t('requestDetail.header.submittedOn', {
                  date: data.submittedDate,
                  time: data.submittedTime
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='min-w-[300px] rounded-lg border border-neutral-200 bg-brand-50/50 p-4'>
        <h3 className='mb-2 text-xs font-semibold tracking-wider text-neutral-600 uppercase'>
          {t('requestDetail.header.currentStatusTitle')}
        </h3>
        <p className='mb-1 text-base font-bold text-brand-700'>{t('requestDetail.header.currentStatusValue')}</p>
        <p className='flex items-center gap-1.5 text-sm text-neutral-600'>
          <Clock className='h-4 w-4 shrink-0 text-brand-500' />
          <span>{t(data.currentStatusDescKey)}</span>
        </p>
      </div>
    </div>
  )
}
