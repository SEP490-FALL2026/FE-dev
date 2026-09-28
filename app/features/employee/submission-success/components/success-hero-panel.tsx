import { Check, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SuccessHeroPanelProps {
  requestId?: string
}

export function SuccessHeroPanel({ requestId = 'REQ-1027' }: SuccessHeroPanelProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center p-8 text-center sm:p-10'>
      {/* Visual illustration with confetti */}
      <div className='relative mb-6 flex h-32 w-32 items-center justify-center'>
        {/* Decorative confetti */}
        <div aria-hidden='true' className='absolute top-0 right-4 h-2 w-2 rotate-45 rounded-xs bg-brand-500' />
        <div
          aria-hidden='true'
          className='absolute top-8 left-0 h-2.5 w-2.5 rounded-full border-2 border-status-success'
        />
        <div aria-hidden='true' className='absolute bottom-8 left-4 h-2 w-2 rounded-xs bg-brand-300' />
        <div aria-hidden='true' className='absolute top-4 right-1/4 h-1.5 w-1.5 rounded-full bg-brand-500' />
        <div
          aria-hidden='true'
          className='absolute right-1/4 bottom-4 h-2 w-2 rotate-12 rounded-xs bg-status-success'
        />
        <div aria-hidden='true' className='absolute right-0 bottom-12 h-1.5 w-1.5 rounded-full bg-status-success' />
        <div aria-hidden='true' className='absolute top-12 right-2 h-3 w-3 rotate-12 rounded-xs bg-brand-300' />

        {/* Main Checkmark Circle */}
        <div className='relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F8F0] shadow-xs'>
          <Check className='h-12 w-12 text-[#3DB87F]' strokeWidth={3} />
        </div>
      </div>

      <h2 className='mb-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>
        {t('submissionSuccess.hero.title')}
      </h2>
      <p className='mx-auto mb-8 max-w-md text-base leading-relaxed text-neutral-600'>
        {t('submissionSuccess.hero.subtitle')}
      </p>

      {/* Request ID Badge */}
      <div className='mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-xl border border-[#D1F2E2] bg-[#F2FBF6] p-6 shadow-inner'>
        <div className='mb-1 flex items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F8F0]'>
            <FileText className='h-4 w-4 text-[#3DB87F]' />
          </div>
          <span className='text-sm font-medium text-neutral-600'>{t('submissionSuccess.hero.requestIdLabel')}</span>
        </div>
        <div className='mb-1.5 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>{requestId}</div>
        <p className='text-sm text-neutral-500'>{t('submissionSuccess.hero.submittedAt')}</p>
      </div>
    </div>
  )
}
