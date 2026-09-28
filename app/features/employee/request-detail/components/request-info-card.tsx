import { useTranslation } from 'react-i18next'

import type { RequestDetailData } from '../request-detail.types'

interface RequestInfoCardProps {
  data: RequestDetailData
}

export function RequestInfoCard({ data }: RequestInfoCardProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h3 className='mb-5 text-base font-bold text-neutral-900'>{t('requestDetail.info.title')}</h3>

      <div className='grid grid-cols-[1fr_2fr] gap-y-4 text-sm'>
        <div className='text-neutral-600'>{t('requestDetail.info.software')}</div>
        <div className='font-medium text-neutral-900'>{data.softwareName.split(' ')[0]}</div>

        <div className='text-neutral-600'>{t('requestDetail.info.plan')}</div>
        <div className='font-medium text-neutral-900'>{data.plan}</div>

        <div className='text-neutral-600'>{t('requestDetail.info.requestType')}</div>
        <div className='font-medium text-neutral-900'>{t(data.requestTypeBadge)}</div>

        <div className='text-neutral-600'>{t('requestDetail.info.businessReason')}</div>
        <div className='leading-relaxed text-neutral-900'>{data.businessReason}</div>

        <div className='text-neutral-600'>{t('requestDetail.info.project')}</div>
        <div className='text-neutral-900'>{data.project}</div>

        <div className='text-neutral-600'>{t('requestDetail.info.costCenter')}</div>
        <div className='text-neutral-900'>{data.costCenter}</div>

        <div className='text-neutral-600'>{t('requestDetail.info.requiredFrom')}</div>
        <div className='text-neutral-900'>{data.requiredFrom}</div>

        <div className='text-neutral-600'>{t('requestDetail.info.requiredUntil')}</div>
        <div className='text-neutral-900'>{data.requiredUntil}</div>

        <div className='flex items-center text-neutral-600'>{t('requestDetail.info.submittedBy')}</div>
        <div className='flex items-center gap-2'>
          <img
            alt={data.submittedBy.name}
            className='h-6 w-6 rounded-full border border-neutral-200 object-cover'
            src={data.submittedBy.avatarUrl}
          />
          <span className='font-medium text-neutral-900'>{data.submittedBy.name}</span>
        </div>

        <div className='text-neutral-600'>{t('requestDetail.info.submittedDate')}</div>
        <div className='text-neutral-900'>{`${data.submittedDate} at ${data.submittedTime}`}</div>
      </div>
    </div>
  )
}
