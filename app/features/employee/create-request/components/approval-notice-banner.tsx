import { ArrowRight, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export function ApprovalNoticeBanner() {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center'>
      <div className='flex items-start gap-4'>
        <div className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-xs sm:mt-0'>
          <Info className='h-5 w-5' />
        </div>
        <div>
          <h3 className='font-bold text-neutral-900'>{t('createRequest.banner.title')}</h3>
          <p className='mt-0.5 text-sm text-neutral-600'>{t('createRequest.banner.description')}</p>
        </div>
      </div>

      <Link
        className='flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline'
        to='/employee/my-requests'
      >
        <span>{t('createRequest.banner.learnMore')}</span>
        <ArrowRight className='h-4 w-4' />
      </Link>
    </div>
  )
}
