import { Info, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareDetailData } from '../software-detail.types'

interface GeneralInfoCardProps {
  data: SoftwareDetailData
}

export function GeneralInfoCard({ data }: GeneralInfoCardProps) {
  const { t } = useTranslation()

  return (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs'>
      {/* Header */}
      <div className='mb-5 flex items-center gap-2'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-500'>
          <ShieldCheck className='h-4 w-4' />
        </div>
        <h2 className='text-base font-bold text-neutral-900'>{t('softwareDetail.generalInfo.title')}</h2>
      </div>

      {/* Two-Column Grid */}
      <div className='grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2'>
        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.appName')}</span>
          <span className='font-semibold text-neutral-900'>{data.name}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.assignedDate')}</span>
          <span className='font-semibold text-neutral-900'>{data.assignedDate}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.category')}</span>
          <span className='font-semibold text-neutral-900'>{data.category}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>
            {t('softwareDetail.generalInfo.expirationDate')}
          </span>
          <span className='font-semibold text-neutral-900'>{data.expirationDate}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.provider')}</span>
          <span className='font-semibold text-neutral-900'>{data.provider}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.autoRenewal')}</span>
          <div className='flex items-center gap-1 font-semibold text-neutral-900'>
            <span>{t('softwareDetail.generalInfo.autoRenewalOn')}</span>
            <Info className='h-3.5 w-3.5 text-neutral-400' />
          </div>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.plan')}</span>
          <span className='font-semibold text-neutral-900'>{data.plan}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.status')}</span>
          <div className='flex items-center gap-1.5 font-semibold text-neutral-900'>
            <span className='h-2 w-2 rounded-full bg-status-active' />
            {t('softwareDetail.generalInfo.statusActive')}
          </div>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.licenseType')}</span>
          <span className='font-medium text-neutral-900'>{data.licenseType}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.costCenter')}</span>
          <span className='font-medium text-neutral-900'>{data.costCenter}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.owner')}</span>
          <span className='font-medium text-neutral-900'>{data.owner}</span>
        </div>

        <div>
          <span className='mb-0.5 block text-xs text-neutral-500'>{t('softwareDetail.generalInfo.project')}</span>
          <span className='font-medium text-neutral-900'>{data.project}</span>
        </div>
      </div>
    </section>
  )
}
