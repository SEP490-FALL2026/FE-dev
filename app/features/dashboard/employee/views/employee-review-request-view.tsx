import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeReviewRequestViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
  requestParams?: Record<string, string>
}

export function EmployeeReviewRequestView({ onSelectTab, requestParams = {} }: EmployeeReviewRequestViewProps) {
  const { t } = useTranslation('dashboard')

  const softwareName = requestParams.softwareName || 'Figma'
  const plan = requestParams.plan || 'Professional / Enterprise'
  const reason =
    requestParams.reason || requestParams.note || 'Nhu cầu thiết kế UI/UX và cộng tác dự án với bộ phận Frontend.'
  const project = requestParams.project || 'Dự án Alpha Portal'
  const requestType = requestParams.type || 'newSoftware'

  const handleBack = () => {
    if (requestType === 'renewal') {
      onSelectTab('temporary-renewal')
    } else if (requestType === 'returnLicense') {
      onSelectTab('return-license')
    } else {
      onSelectTab('request-new-software')
    }
  }

  const handleSubmit = () => {
    onSelectTab('submission-success', {
      id: 'REQ-1027',
      softwareName,
      type: requestType
    })
  }

  return (
    <div className='mx-auto max-w-5xl space-y-6'>
      {/* Heading */}
      <div>
        <button
          className='inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition hover:text-foreground'
          onClick={handleBack}
          type='button'
        >
          <ArrowLeft aria-hidden='true' className='size-4' />
          <span>{t('employee.reviewRequest.actBack')}</span>
        </button>
        <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.reviewRequest.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.reviewRequest.subtitle')}</p>
      </div>

      {/* Stepper */}
      <div className='flex items-center justify-between rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex items-center gap-3 opacity-60'>
          <span className='grid size-7 place-items-center rounded-full bg-success text-xs font-bold text-white'>
            <CheckCircle2 aria-hidden='true' className='size-4' />
          </span>
          <span className='text-xs font-medium text-foreground'>{t('employee.requestNewSoftware.step1')}</span>
        </div>
        <div className='h-0.5 w-16 bg-primary' />
        <div className='flex items-center gap-3'>
          <span className='grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
            {2}
          </span>
          <span className='text-xs font-bold text-foreground'>{t('employee.requestNewSoftware.step2')}</span>
        </div>
        <div className='h-0.5 w-16 bg-border' />
        <div className='flex items-center gap-3 opacity-50'>
          <span className='grid size-7 place-items-center rounded-full border border-border text-xs font-bold text-muted-foreground'>
            {3}
          </span>
          <span className='text-xs font-medium text-muted-foreground'>{t('employee.requestNewSoftware.step3')}</span>
        </div>
      </div>

      {/* Grid: 7 cols Left, 5 cols Right */}
      <div className='grid gap-6 lg:grid-cols-12'>
        {/* Left Column */}
        <div className='space-y-6 lg:col-span-7'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.reviewRequest.summaryTitle')}</h2>

            <div className='divide-y divide-border/70 text-xs'>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.software')}</span>
                <span className='font-bold text-foreground'>{softwareName}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.plan')}</span>
                <span className='font-medium text-foreground'>{plan}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.project')}</span>
                <span className='font-medium text-foreground'>{project}</span>
              </div>
              <div className='py-2.5'>
                <span className='text-muted-foreground'>{t('employee.requestDetail.reason')}</span>
                <p className='mt-1 rounded-xl border border-border/70 bg-surface-subtle/50 p-3 text-foreground'>
                  {reason}
                </p>
              </div>
            </div>

            <div className='flex items-center justify-between pt-4 border-t border-border'>
              <button
                className='rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground'
                onClick={handleBack}
                type='button'
              >
                {t('employee.reviewRequest.actBack')}
              </button>
              <button
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90'
                onClick={handleSubmit}
                type='button'
              >
                <span>{t('employee.reviewRequest.actSubmit')}</span>
                <ArrowRight aria-hidden='true' className='size-3.5' />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Approval Path Preview */}
        <div className='space-y-6 lg:col-span-5'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
            <h2 className='text-sm font-bold text-foreground'>{t('employee.reviewRequest.approvalFlowTitle')}</h2>
            <div className='mt-4 space-y-4 border-l-2 border-border/80 pl-4 ml-2 text-xs'>
              <div>
                <p className='font-bold text-foreground'>{t('employee.reviewRequest.flowStep1Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>{t('employee.reviewRequest.flowStep1Desc')}</p>
              </div>
              <div>
                <p className='font-bold text-foreground'>{t('employee.reviewRequest.flowStep2Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>{t('employee.reviewRequest.flowStep2Desc')}</p>
              </div>
              <div>
                <p className='font-bold text-muted-foreground'>{t('employee.reviewRequest.flowStep3Title')}</p>
                <p className='text-muted-foreground text-[0.7rem]'>{t('employee.reviewRequest.flowStep3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
