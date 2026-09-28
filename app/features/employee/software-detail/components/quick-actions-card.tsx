import { ArrowRight, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface QuickActionsCardProps {
  onRequestChangePlan: () => void
  onRequestRenewal: () => void
  onReturnLicense: () => void
}

export function QuickActionsCard({ onRequestChangePlan, onRequestRenewal, onReturnLicense }: QuickActionsCardProps) {
  const { t } = useTranslation()

  return (
    <section className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs'>
      {/* Header */}
      <div className='mb-4 flex items-center gap-2'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-500'>
          <Zap className='h-4 w-4' />
        </div>
        <h2 className='text-base font-bold text-neutral-900'>{t('dashboard.quickActions.title')}</h2>
      </div>

      {/* Action Buttons List */}
      <div className='space-y-2.5'>
        <button
          className='group flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-900 transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-500'
          onClick={onRequestChangePlan}
          type='button'
        >
          <span>{t('softwareDetail.actions.requestChangePlan')}</span>
          <ArrowRight className='h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500' />
        </button>

        <button
          className='group flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-900 transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-500'
          onClick={onRequestRenewal}
          type='button'
        >
          <span>{t('softwareDetail.actions.requestRenewal')}</span>
          <ArrowRight className='h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500' />
        </button>

        <button
          className='group flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-900 transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-500'
          onClick={onReturnLicense}
          type='button'
        >
          <span>{t('softwareDetail.actions.returnLicense')}</span>
          <ArrowRight className='h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500' />
        </button>
      </div>
    </section>
  )
}
