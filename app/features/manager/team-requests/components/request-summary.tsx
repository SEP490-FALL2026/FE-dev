import { ArrowRight, CircleCheck, CircleX, Clock3, RefreshCw, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { overviewCounts, requestStatuses } from '~/entities/request/manager-requests-demo'
import type { RequestFilters } from '../hooks/use-request-filters'

const icons = {
  pending: Clock3,
  inProgress: RefreshCw,
  approved: CircleCheck,
  rejected: CircleX,
  overdue: TriangleAlert
}
export function RequestSummary({ filters, update }: Pick<RequestFilters, 'filters' | 'update'>) {
  const { t, i18n } = useTranslation()
  const number = new Intl.NumberFormat(i18n.resolvedLanguage)
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      {requestStatuses.map((status) => {
        const Icon = icons[status]
        const tone =
          status === 'approved'
            ? 'bg-success/10 text-success'
            : status === 'rejected' || status === 'overdue'
              ? 'bg-danger/10 text-danger'
              : 'bg-brand-100 text-brand-600'
        return (
          <section key={status} className='flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm'>
            <div className='mb-4 flex items-center gap-2'>
              <span className={`flex size-8 items-center justify-center rounded-full ${tone}`}>
                <Icon size={16} aria-hidden='true' />
              </span>
              <h2 className='text-sm font-medium text-neutral-500'>{t(`teamRequests.statuses.${status}`)}</h2>
            </div>
            <p className='text-3xl font-bold tabular-nums'>{number.format(overviewCounts[status])}</p>
            <p className='mt-1 mb-3 text-sm text-neutral-500'>{t('teamRequests.requests')}</p>
            <button
              type='button'
              aria-pressed={filters.status === status}
              aria-label={t('teamRequests.viewStatus', { status: t(`teamRequests.statuses.${status}`) })}
              onClick={() => update('status', status)}
              className='mt-auto flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline'
            >
              {t('teamRequests.viewAll')}
              <ArrowRight size={14} aria-hidden='true' />
            </button>
          </section>
        )
      })}
    </div>
  )
}
