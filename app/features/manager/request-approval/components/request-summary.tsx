import { useTranslation } from 'react-i18next'

import type { TeamRequest } from '~/entities/request/manager-requests-demo'
import { RequestBadge } from '~/entities/request/request-badge'
import { RequestSoftware } from '~/entities/request/request-software'

export function RequestSummary({ request }: { request: TeamRequest }) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  const sla =
    request.hoursLeft >= 24
      ? t('teamRequests.daysLeft', { value: number.format(request.hoursLeft / 24) })
      : t('teamRequests.hoursLeft', { value: number.format(request.hoursLeft) })
  return (
    <section
      className='rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'
      aria-label={t('teamRequests.detailTitle', { id: request.id })}
    >
      <div className='mb-6 flex flex-wrap items-center gap-3'>
        <span className='rounded-md border border-neutral-200 bg-brand-bg px-2.5 py-1 text-xs font-semibold'>
          {request.id}
        </span>
        {request.status === 'pending' ? (
          <span className='rounded-md border border-brand-200 bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600'>
            {t('requestApproval.pending')}
          </span>
        ) : (
          <RequestBadge status={request.status} />
        )}
      </div>
      <RequestSoftware request={request} large />
      <dl className='mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4'>
        <div>
          <dt className='mb-1 text-xs font-medium text-neutral-500'>{t('teamRequests.type')}</dt>
          <dd className='text-sm font-semibold'>{t(`teamRequests.types.${request.type}`)}</dd>
        </div>
        <div>
          <dt className='mb-1 text-xs font-medium text-neutral-500'>{t('teamRequests.sla')}</dt>
          <dd className={`text-sm font-semibold ${request.status === 'overdue' ? 'text-danger' : 'text-brand-600'}`}>
            {sla}
          </dd>
        </div>
        <div>
          <dt className='mb-1 text-xs font-medium text-neutral-500'>{t('requestApproval.requestedDate')}</dt>
          <dd className='text-sm font-semibold'>
            <time dateTime={request.submitted}>
              {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'Asia/Ho_Chi_Minh'
              }).format(new Date(request.submitted))}
            </time>
          </dd>
        </div>
        <div>
          <dt className='mb-1 text-xs font-medium text-neutral-500'>{t('requestApproval.due')}</dt>
          <dd className='text-sm font-semibold text-neutral-500'>{t('requestApproval.unknown')}</dd>
        </div>
      </dl>
      {request.status === 'overdue' && (
        <p className='mt-4 text-xs leading-relaxed text-danger'>
          {t('teamRequests.slaMismatch', { value: number.format(request.hoursLeft) })}
        </p>
      )}
    </section>
  )
}
