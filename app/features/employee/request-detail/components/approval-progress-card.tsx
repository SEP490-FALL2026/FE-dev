import { Check, Clock, DollarSign, Settings, Trash2, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ApprovalProgressCardProps {
  managerName: string
  submittedDate: string
  submittedTime: string
  onCancelRequest?: () => void
}

export function ApprovalProgressCard({
  managerName,
  submittedDate,
  submittedTime,
  onCancelRequest
}: ApprovalProgressCardProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h3 className='mb-6 text-base font-bold text-neutral-900'>{t('requestDetail.progress.title')}</h3>

      <div className='relative'>
        {/* Continuous vertical timeline connector line */}
        <div className='absolute top-4 bottom-8 left-[15px] w-0.5 bg-neutral-200' />

        {/* Step 1: Completed */}
        <div className='relative mb-8 flex gap-4'>
          <div className='z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-status-active text-white shadow-xs'>
            <Check className='h-4 w-4' />
          </div>
          <div className='flex-1 pt-1'>
            <div className='flex items-center justify-between'>
              <h4 className='text-sm font-semibold text-neutral-900'>{t('requestDetail.progress.step1Title')}</h4>
              <span className='rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-status-active'>
                {t('requestDetail.progress.step1Status')}
              </span>
            </div>
            <p className='mt-1 text-sm text-neutral-600'>{`${submittedDate} at ${submittedTime}`}</p>
          </div>
        </div>

        {/* Step 2: In Progress */}
        <div className='relative mb-8 flex gap-4'>
          <div className='z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-brand-100 text-brand-500 shadow-xs ring-2 ring-brand-500'>
            <User className='h-4 w-4' />
          </div>
          <div className='flex-1 pt-1'>
            <div className='mb-1 flex items-center justify-between'>
              <h4 className='text-sm font-semibold text-neutral-900'>{t('requestDetail.progress.step2Title')}</h4>
              <span className='rounded border border-brand-200/60 bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700'>
                {t('requestDetail.progress.step2Status')}
              </span>
            </div>
            <p className='mb-3 text-sm text-neutral-600'>{t('requestDetail.progress.step2Desc')}</p>
            <div className='flex gap-3 rounded-lg border border-brand-200 bg-brand-50/50 p-3'>
              <Clock className='mt-0.5 h-5 w-5 shrink-0 text-brand-500' />
              <div>
                <p className='text-sm font-semibold text-brand-700'>{t('requestDetail.progress.step2NoticeTitle')}</p>
                <p className='mt-0.5 text-sm text-brand-800/90'>
                  {t('requestDetail.progress.step2NoticeDesc', { name: managerName })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Not Required */}
        <div className='relative mb-8 flex gap-4'>
          <div className='z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-neutral-100 text-neutral-400 shadow-xs'>
            <DollarSign className='h-4 w-4' />
          </div>
          <div className='flex-1 pt-1 opacity-75'>
            <div className='mb-1 flex items-center justify-between'>
              <h4 className='text-sm font-semibold text-neutral-600'>{t('requestDetail.progress.step3Title')}</h4>
              <span className='rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600'>
                {t('requestDetail.progress.step3Status')}
              </span>
            </div>
            <p className='text-sm text-neutral-600'>{t('requestDetail.progress.step3Desc')}</p>
          </div>
        </div>

        {/* Step 4: Pending */}
        <div className='relative mb-8 flex gap-4'>
          <div className='z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-neutral-100 text-neutral-400 shadow-xs'>
            <Settings className='h-4 w-4' />
          </div>
          <div className='flex-1 pt-1 opacity-75'>
            <div className='mb-1 flex items-center justify-between'>
              <h4 className='text-sm font-semibold text-neutral-600'>{t('requestDetail.progress.step4Title')}</h4>
              <span className='rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600'>
                {t('requestDetail.progress.step4Status')}
              </span>
            </div>
            <p className='text-sm text-neutral-600'>{t('requestDetail.progress.step4Desc')}</p>
          </div>
        </div>

        {/* Step 5: Completed */}
        <div className='relative flex gap-4'>
          <div className='z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-neutral-100 text-neutral-400 shadow-xs'>
            <Check className='h-4 w-4' />
          </div>
          <div className='flex-1 pt-1 opacity-75'>
            <div className='mb-1 flex items-center justify-between'>
              <h4 className='text-sm font-semibold text-neutral-600'>{t('requestDetail.progress.step5Title')}</h4>
              <span className='rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600'>
                {t('requestDetail.progress.step5Status')}
              </span>
            </div>
            <p className='text-sm text-neutral-600'>{t('requestDetail.progress.step5Desc')}</p>
          </div>
        </div>
      </div>

      {/* Cancel action */}
      <div className='mt-8 border-t border-neutral-200 pt-6'>
        <button
          className='flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-rose-500 shadow-xs transition-colors hover:border-rose-200 hover:bg-rose-50/50'
          onClick={onCancelRequest}
          type='button'
        >
          <Trash2 className='h-4 w-4' />
          <span>{t('requestDetail.progress.cancelAction')}</span>
        </button>
        <p className='mt-3 text-xs text-neutral-500'>{t('requestDetail.progress.cancelDisclaimer')}</p>
      </div>
    </div>
  )
}
