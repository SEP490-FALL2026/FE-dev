import { ChevronRight, Shapes } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { employeeDetailDemo } from '../employee-detail-demo'

export function EmployeeRequest({ onView }: { onView?: () => void }) {
  const { t, i18n } = useTranslation()
  const request = employeeDetailDemo.request
  const date = new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(`${request.requested}T00:00:00Z`)
  )
  const content = (
    <>
      <span className='mt-0.5 rounded bg-brand-100 p-1.5 text-brand-500'>
        <Shapes size={16} aria-hidden='true' />
      </span>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm font-medium'>{request.software}</span>
          <span className='rounded border border-brand-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-brand-600'>
            {t('employeeDetail.newAccess')}
          </span>
        </div>
        <p className='mt-0.5 mb-1 text-xs text-neutral-500'>{t('employeeDetail.planName', { plan: request.plan })}</p>
        <p className='text-xs text-neutral-500'>{t('employeeDetail.requestedOn', { date })}</p>
        <p className='mt-1 text-xs text-neutral-500'>{t('employeeDetail.sla', { count: request.slaHours })}</p>
      </div>
      <span className='rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-medium text-brand-600'>
        {t('employeeDetail.pending')}
      </span>
      {onView && <ChevronRight size={12} className='text-neutral-500' aria-hidden='true' />}
    </>
  )
  return onView ? (
    <button
      type='button'
      onClick={onView}
      className='flex w-full items-start gap-3 rounded-lg border border-neutral-200 p-3 text-left transition-colors hover:bg-brand-bg'
    >
      {content}
    </button>
  ) : (
    <div className='flex items-start gap-3 rounded-lg border border-neutral-200 p-4'>{content}</div>
  )
}
