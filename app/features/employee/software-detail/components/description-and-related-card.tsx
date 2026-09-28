import { FileText, Link2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { SoftwareDetailData } from '../software-detail.types'

interface DescriptionAndRelatedCardProps {
  data: SoftwareDetailData
}

export function DescriptionAndRelatedCard({ data }: DescriptionAndRelatedCardProps) {
  const { t } = useTranslation()

  return (
    <div className='space-y-6'>
      {/* Description Card */}
      <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs'>
        <div className='mb-3 flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-500'>
            <FileText className='h-4 w-4' />
          </div>
          <h2 className='text-base font-bold text-neutral-900'>{t('softwareDetail.descriptionCard.title')}</h2>
        </div>
        <p className='text-sm leading-relaxed text-neutral-600 sm:pl-10'>
          {t('softwareDetail.descriptionCard.figmaDesc')}
        </p>
      </section>

      {/* Related Information Card */}
      <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs'>
        <div className='mb-4 flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-500'>
            <Link2 className='h-4 w-4' />
          </div>
          <h2 className='text-base font-bold text-neutral-900'>{t('softwareDetail.relatedInfo.title')}</h2>
        </div>

        <div className='grid grid-cols-1 gap-4 pt-1 text-xs sm:grid-cols-4'>
          <div>
            <span className='mb-1 block text-neutral-500'>{t('softwareDetail.relatedInfo.businessOwner')}</span>
            <div className='flex items-center gap-2'>
              <div className='flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white'>
                {data.businessOwner.initials}
              </div>
              <div>
                <span className='block font-semibold text-neutral-900'>{data.businessOwner.name}</span>
                <span className='text-[10px] text-neutral-500'>{data.businessOwner.title}</span>
              </div>
            </div>
          </div>

          <div>
            <span className='mb-1 block text-neutral-500'>{t('softwareDetail.relatedInfo.team')}</span>
            <span className='font-semibold text-neutral-900'>{data.team}</span>
          </div>

          <div>
            <span className='mb-1 block text-neutral-500'>{t('softwareDetail.relatedInfo.department')}</span>
            <span className='font-semibold text-neutral-900'>{data.department}</span>
          </div>

          <div>
            <span className='mb-1 block text-neutral-500'>{t('softwareDetail.relatedInfo.project')}</span>
            <span className='font-semibold text-neutral-900'>{data.project}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
