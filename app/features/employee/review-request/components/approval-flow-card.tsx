import { ArrowDown, DollarSign, Info, ShieldCheck, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ApprovalStepItem } from '../review-request.types'

export function ApprovalFlowCard() {
  const { t } = useTranslation()

  const steps: ApprovalStepItem[] = [
    {
      id: 'step1',
      stepNumber: 1,
      title: t('reviewRequest.flow.step1Title'),
      subtitle: t('reviewRequest.flow.step1Sub'),
      status: 'completed',
      statusText: t('reviewRequest.flow.step1Status')
    },
    {
      id: 'step2',
      stepNumber: 2,
      title: t('reviewRequest.flow.step2Title'),
      subtitle: t('reviewRequest.flow.step2Sub'),
      status: 'pending',
      statusText: t('reviewRequest.flow.step2Status')
    },
    {
      id: 'step3',
      stepNumber: 3,
      title: t('reviewRequest.flow.step3Title'),
      subtitle: t('reviewRequest.flow.step3Sub'),
      status: 'not_required',
      statusText: t('reviewRequest.flow.step3Status')
    },
    {
      id: 'step4',
      stepNumber: 4,
      title: t('reviewRequest.flow.step4Title'),
      subtitle: t('reviewRequest.flow.step4Sub'),
      status: 'upcoming',
      statusText: t('reviewRequest.flow.step4Status')
    }
  ]

  const getStepIcon = (step: ApprovalStepItem) => {
    switch (step.id) {
      case 'step1':
        return (
          <div className='z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-emerald-50 text-emerald-600'>
            <User className='h-5 w-5' />
          </div>
        )
      case 'step2':
        return (
          <div className='z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-brand-500'>
            <User className='h-5 w-5' />
          </div>
        )
      case 'step3':
        return (
          <div className='z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-purple-600'>
            <DollarSign className='h-5 w-5' />
          </div>
        )
      case 'step4':
      default:
        return (
          <div className='z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600'>
            <ShieldCheck className='h-5 w-5' />
          </div>
        )
    }
  }

  const getStatusBadge = (step: ApprovalStepItem) => {
    switch (step.status) {
      case 'completed':
        return (
          <span className='inline-flex items-center rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600'>
            {step.statusText}
          </span>
        )
      case 'pending':
        return (
          <span className='inline-flex items-center rounded bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-600'>
            {step.statusText}
          </span>
        )
      case 'not_required':
      case 'upcoming':
      default:
        return (
          <span className='inline-flex items-center rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600'>
            {step.statusText}
          </span>
        )
    }
  }

  return (
    <div className='rounded-xl border border-neutral-200 bg-white p-6 shadow-xs'>
      <h2 className='mb-6 text-lg font-semibold text-neutral-900'>{t('reviewRequest.flow.title')}</h2>

      <div className='space-y-6'>
        {steps.map((step, index) => (
          <div key={step.id}>
            <div className='relative flex items-start gap-4'>
              {index < steps.length - 1 && <div className='absolute top-10 left-5 h-6 w-px bg-neutral-200' />}
              {getStepIcon(step)}

              <div className='flex flex-1 items-start justify-between min-w-0'>
                <div>
                  <div className='text-sm font-semibold text-neutral-900'>{step.title}</div>
                  <div className='text-xs text-neutral-500'>{step.subtitle}</div>
                </div>
                {getStatusBadge(step)}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className='-my-2 pl-4.5 text-neutral-300'>
                <ArrowDown className='h-3.5 w-3.5' />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className='mt-6 flex gap-2 rounded-lg border border-brand-200 bg-brand-50 p-3'>
        <Info className='mt-0.5 h-4 w-4 shrink-0 text-brand-500' />
        <p className='text-xs leading-snug text-neutral-600'>{t('reviewRequest.flow.notice')}</p>
      </div>
    </div>
  )
}
