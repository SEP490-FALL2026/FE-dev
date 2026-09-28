import { DollarSign, Settings, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ApprovalFlowCardProps {
  managerName: string
}

export function ApprovalFlowCard({ managerName }: ApprovalFlowCardProps) {
  const { t } = useTranslation()

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h3 className='mb-6 text-base font-bold text-neutral-900'>{t('requestDetail.flow.title')}</h3>

      <div className='mx-auto flex max-w-lg items-center justify-between text-center'>
        {/* Step 1: Employee */}
        <div className='flex flex-col items-center'>
          <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-500'>
            <User className='h-5 w-5' />
          </div>
          <span className='text-xs font-semibold text-neutral-900'>{t('requestDetail.flow.employee')}</span>
          <span className='text-xs text-neutral-500'>{t('requestDetail.flow.employeeSub')}</span>
        </div>

        {/* Arrow connector */}
        <div className='relative mx-2 h-px w-8 bg-neutral-200'>
          <div className='absolute top-1/2 right-0 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-t border-r border-neutral-400' />
        </div>

        {/* Step 2: Manager */}
        <div className='flex flex-col items-center'>
          <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-brand-300 bg-brand-100 text-brand-500 ring-2 ring-brand-500 ring-offset-2'>
            <User className='h-5 w-5' />
          </div>
          <span className='text-xs font-semibold text-neutral-900'>{t('requestDetail.flow.manager')}</span>
          <span className='text-xs font-medium text-brand-600'>{managerName}</span>
        </div>

        {/* Arrow connector */}
        <div className='relative mx-2 h-px w-8 bg-neutral-200'>
          <div className='absolute top-1/2 right-0 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-t border-r border-neutral-400' />
        </div>

        {/* Step 3: Finance */}
        <div className='flex flex-col items-center opacity-60'>
          <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500'>
            <DollarSign className='h-5 w-5' />
          </div>
          <span className='text-xs font-semibold text-neutral-900'>{t('requestDetail.flow.finance')}</span>
          <span className='text-[10px] text-neutral-500'>{t('requestDetail.flow.financeSub')}</span>
        </div>

        {/* Arrow connector */}
        <div className='relative mx-2 h-px w-8 bg-neutral-200'>
          <div className='absolute top-1/2 right-0 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-t border-r border-neutral-400' />
        </div>

        {/* Step 4: IT Admin */}
        <div className='flex flex-col items-center opacity-60'>
          <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500'>
            <Settings className='h-5 w-5' />
          </div>
          <span className='text-xs font-semibold text-neutral-900'>{t('requestDetail.flow.itAdmin')}</span>
          <span className='text-[10px] text-neutral-500'>{t('requestDetail.flow.itAdminSub')}</span>
        </div>
      </div>
    </div>
  )
}
