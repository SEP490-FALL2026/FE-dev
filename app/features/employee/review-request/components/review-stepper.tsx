import { useTranslation } from 'react-i18next'

export function ReviewStepper() {
  const { t } = useTranslation()

  return (
    <div className='flex items-center'>
      <div className='flex items-center text-sm font-medium'>
        {/* Step 1 */}
        <div className='flex items-center gap-2'>
          <span className='flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-xs text-neutral-500'>
            {1}
          </span>
          <span className='text-neutral-500'>{t('reviewRequest.stepper.step1')}</span>
        </div>

        <div className='mx-4 h-px w-8 bg-neutral-300' />

        {/* Step 2 */}
        <div className='flex items-center gap-2'>
          <span className='flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-xs text-neutral-500'>
            {2}
          </span>
          <span className='text-neutral-500'>{t('reviewRequest.stepper.step2')}</span>
        </div>

        <div className='mx-4 h-px w-8 bg-neutral-300' />

        {/* Step 3 (Active) */}
        <div className='flex items-center gap-2 font-semibold text-brand-500'>
          <span className='flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs text-white'>
            {3}
          </span>
          <span>{t('reviewRequest.stepper.step3')}</span>
        </div>

        <div className='mx-4 h-px w-8 bg-neutral-300' />

        {/* Step 4 */}
        <div className='flex items-center gap-2'>
          <span className='flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-xs text-neutral-400'>
            {4}
          </span>
          <span className='text-neutral-400'>{t('reviewRequest.stepper.step4')}</span>
        </div>
      </div>
    </div>
  )
}
