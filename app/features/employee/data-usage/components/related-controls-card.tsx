import { ArrowRight, Download, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export function RelatedControlsCard() {
  const { t } = useTranslation()

  return (
    <div className='space-y-2 rounded-2xl border border-neutral-200 bg-[#FEFBF7] p-5'>
      <h4 className='text-xs font-bold uppercase tracking-wider text-neutral-900'>
        {t('dataUsage.relatedControls.title')}
      </h4>

      <Link
        className='flex items-center justify-between rounded-xl border border-transparent p-2.5 text-xs font-semibold text-neutral-900 transition hover:border-neutral-200 hover:bg-white'
        to='/employee/profile/data-export'
      >
        <span className='flex items-center gap-2'>
          <Download className='h-4 w-4 text-brand-500' />
          {t('dataUsage.relatedControls.requestExport')}
        </span>
        <ArrowRight className='h-3.5 w-3.5 text-brand-500' />
      </Link>

      <Link
        className='flex items-center justify-between rounded-xl border border-transparent p-2.5 text-xs font-semibold text-neutral-900 transition hover:border-neutral-200 hover:bg-white'
        to='/employee/profile#data-privacy'
      >
        <span className='flex items-center gap-2'>
          <SlidersHorizontal className='h-4 w-4 text-brand-500' />
          {t('dataUsage.relatedControls.manageConsents')}
        </span>
        <ArrowRight className='h-3.5 w-3.5 text-brand-500' />
      </Link>
    </div>
  )
}
