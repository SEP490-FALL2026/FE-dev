import { Check, DollarSign, Flag, Info, Navigation, ShieldCheck, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SubmissionTimelineSidebar() {
  const { t } = useTranslation()

  return (
    <div className='w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-xs lg:w-80'>
      <h3 className='mb-6 text-lg font-bold text-neutral-900'>{t('submissionSuccess.timeline.title')}</h3>

      {/* Alert Banner */}
      <div className='mb-8 flex items-start gap-3 rounded-lg border border-[#D1F2E2] bg-[#F2FBF6] p-4 text-[#3DB87F]'>
        <Navigation className='mt-0.5 h-5 w-5 shrink-0 rotate-45' />
        <p className='text-sm font-medium'>{t('submissionSuccess.timeline.alertBanner')}</p>
      </div>

      <h4 className='mb-4 text-sm font-bold text-neutral-900'>{t('submissionSuccess.timeline.currentStep')}</h4>

      {/* Timeline List */}
      <div className='relative pl-2 pb-2'>
        {/* Step 1: Completed */}
        <div className='relative mb-6'>
          <div className='absolute top-8 bottom-0 left-4 w-0.5 bg-neutral-200' />
          <div className='flex items-start gap-4'>
            <div className='relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D1F2E2] bg-[#E8F8F0]'>
              <Check className='h-4 w-4 text-[#3DB87F]' strokeWidth={2.5} />
            </div>
            <div>
              <h5 className='text-sm font-bold text-neutral-900'>{t('submissionSuccess.timeline.step1Title')}</h5>
              <p className='mt-1 text-xs text-neutral-500'>{t('submissionSuccess.timeline.step1Date')}</p>
            </div>
          </div>
        </div>

        {/* Step 2: Pending (Active) */}
        <div className='relative mb-6'>
          <div className='absolute top-8 bottom-0 left-4 w-0.5 border-l-2 border-dashed border-neutral-300' />
          <div className='flex items-start gap-4'>
            <div className='relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-300 bg-brand-100 ring-4 ring-white'>
              <User className='h-4 w-4 text-brand-500' />
            </div>
            <div>
              <h5 className='text-sm font-bold text-neutral-900'>{t('submissionSuccess.timeline.step2Title')}</h5>
              <span className='mt-1 inline-block rounded-md bg-brand-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-600 uppercase'>
                {t('submissionSuccess.timeline.step2Status')}
              </span>
              <p className='mt-2 text-xs leading-relaxed text-neutral-600'>
                {t('submissionSuccess.timeline.step2Desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Finance review (Upcoming) */}
        <div className='relative mb-6 opacity-60'>
          <div className='absolute top-8 bottom-0 left-4 w-0.5 border-l-2 border-dashed border-neutral-300' />
          <div className='flex items-start gap-4'>
            <div className='relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-[#FEFBF7] text-neutral-500'>
              <DollarSign className='h-4 w-4' />
            </div>
            <div className='mt-1.5 flex items-center gap-2'>
              <h5 className='text-sm font-medium text-neutral-700'>{t('submissionSuccess.timeline.step3Title')}</h5>
              <span className='rounded-md bg-[#FEF5ED] px-2 py-0.5 text-[10px] font-medium text-neutral-600'>
                {t('submissionSuccess.timeline.step3Badge')}
              </span>
            </div>
          </div>
        </div>

        {/* Step 4: IT provisioning (Upcoming) */}
        <div className='relative mb-6 opacity-60'>
          <div className='absolute top-8 bottom-0 left-4 w-0.5 border-l-2 border-dashed border-neutral-300' />
          <div className='flex items-start gap-4'>
            <div className='relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-[#FEFBF7] text-neutral-500'>
              <ShieldCheck className='h-4 w-4' />
            </div>
            <div className='mt-1.5 flex items-center gap-2'>
              <h5 className='text-sm font-medium text-neutral-700'>{t('submissionSuccess.timeline.step4Title')}</h5>
              <span className='rounded-md bg-[#FEF5ED] px-2 py-0.5 text-[10px] font-medium text-neutral-600'>
                {t('submissionSuccess.timeline.step4Badge')}
              </span>
            </div>
          </div>
        </div>

        {/* Step 5: Completed (Upcoming) */}
        <div className='relative opacity-60'>
          <div className='flex items-start gap-4'>
            <div className='relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-[#FEFBF7] text-neutral-500'>
              <Flag className='h-4 w-4' />
            </div>
            <div className='mt-1.5 flex items-center gap-2'>
              <h5 className='text-sm font-medium text-neutral-700'>{t('submissionSuccess.timeline.step5Title')}</h5>
              <span className='rounded-md bg-[#FEF5ED] px-2 py-0.5 text-[10px] font-medium text-neutral-600'>
                {t('submissionSuccess.timeline.step5Badge')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner Bottom */}
      <div className='mt-8 flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4 text-brand-700'>
        <Info className='mt-0.5 h-5 w-5 shrink-0 text-brand-500' />
        <p className='text-xs leading-relaxed font-medium'>{t('submissionSuccess.timeline.bottomNotice')}</p>
      </div>
    </div>
  )
}
