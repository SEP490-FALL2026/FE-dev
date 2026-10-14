import { FileText, Home, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmployeePreviewNotice } from '../employee-preview-notice'
import type { EmployeeTabKey } from '../employee-nav'

interface EmployeeSubmissionSuccessViewProps {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}

export function EmployeeSubmissionSuccessView({ onSelectTab }: EmployeeSubmissionSuccessViewProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='mx-auto max-w-3xl space-y-8 py-6'>
      <EmployeePreviewNotice>{t('employee.preview.request')}</EmployeePreviewNotice>
      <div className='rounded-3xl border border-border bg-surface p-6 text-center shadow-sm sm:p-8'>
        <span className='mx-auto grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary-ink'>
          <Info aria-hidden='true' className='size-8' />
        </span>
        <h1 className='mt-5 text-2xl font-bold tracking-tight text-foreground'>
          {t('employee.submissionSuccess.previewTitle')}
        </h1>
        <p className='mt-2 text-sm text-muted-foreground leading-relaxed'>
          {t('employee.submissionSuccess.previewSubtitle')}
        </p>

        {/* Action Buttons */}
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <button
            className='inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-action px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
            onClick={() => onSelectTab('my-requests')}
            type='button'
          >
            <FileText aria-hidden='true' className='size-4' />
            <span>{t('employee.submissionSuccess.actViewRequests')}</span>
          </button>
          <button
            className='inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-action'
            onClick={() => onSelectTab('overview')}
            type='button'
          >
            <Home aria-hidden='true' className='size-4 text-muted-foreground' />
            <span>{t('employee.submissionSuccess.actBackDashboard')}</span>
          </button>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <h2 className='text-base font-bold text-foreground'>{t('employee.submissionSuccess.previewTimelineTitle')}</h2>
        <div className='mt-4 space-y-3 text-xs text-muted-foreground'>
          <div className='flex items-start gap-3 rounded-xl border border-border/70 bg-surface-subtle/50 p-3.5'>
            <span className='grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-bold text-[0.7rem]'>
              {1}
            </span>
            <p className='text-foreground'>{t('employee.submissionSuccess.stepManager')}</p>
          </div>
          <div className='flex items-start gap-3 rounded-xl border border-border/70 bg-surface-subtle/50 p-3.5'>
            <span className='grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-bold text-[0.7rem]'>
              {2}
            </span>
            <p className='text-foreground'>{t('employee.submissionSuccess.stepItAdmin')}</p>
          </div>
          <div className='flex items-start gap-3 rounded-xl border border-border/70 bg-surface-subtle/50 p-3.5'>
            <span className='grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-bold text-[0.7rem]'>
              {3}
            </span>
            <p className='text-foreground'>{t('employee.submissionSuccess.stepNotification')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
